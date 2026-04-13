from __future__ import annotations

from aiogram import F, Router
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message, ReplyKeyboardRemove

from app.config import Config
from app.database.sqlite import Database
from app.keyboards.inline import mission_start_keyboard, social_platforms_keyboard
from app.keyboards.reply import contact_keyboard, language_keyboard
from app.services.profile_flow import (
    ask_for_contact,
    ask_goal,
    ask_social_platforms,
    ask_social_time,
    ask_social_usage,
    finish_profile,
    show_main_menu,
)
from app.states.profile import ProfileStates
from app.utils.texts import LANGUAGES, MAIN_MENU_BUTTONS, t

router = Router()

LANGUAGE_BY_BUTTON = {value: key for key, value in LANGUAGES.items()}
MENU_BUTTON_VALUES = {value for group in MAIN_MENU_BUTTONS.values() for value in group.values()}


def _detect_language(text: str) -> str | None:
    normalized = text.strip()
    if normalized in LANGUAGE_BY_BUTTON:
        return LANGUAGE_BY_BUTTON[normalized]
    lowered = normalized.lower()
    if "o'zbek" in lowered or "uzbek" in lowered or "🇺🇿" in normalized:
        return "uz"
    if "english" in lowered or "🇬🇧" in normalized:
        return "en"
    if "рус" in lowered or "🇷🇺" in normalized:
        return "ru"
    return None


def _looks_like_non_name(text: str) -> bool:
    normalized = text.strip()
    return _detect_language(normalized) is not None or normalized in MENU_BUTTON_VALUES


@router.message(CommandStart())
async def command_start(message: Message, state: FSMContext, db: Database, config: Config) -> None:
    await state.clear()
    user = await db.get_user_by_id(message.from_user.id)
    if user:
        lang = user["language"] or "uz"
        await message.answer(t(lang, "existing_user", name=user["full_name"]))
        await show_main_menu(
            message,
            lang,
            user["full_name"],
            is_admin=message.from_user.id == config.admin_id,
            web_app_url=config.web_app_url,
        )
        return

    lang_code = message.from_user.language_code
    if lang_code and lang_code.startswith("ru"):
        initial_lang = "ru"
    elif lang_code and lang_code.startswith("en"):
        initial_lang = "en"
    else:
        initial_lang = "uz"

    display_name = message.from_user.first_name or "Friend"
    await state.set_state(ProfileStates.choosing_language)
    await message.answer(t(initial_lang, "welcome", name=display_name), reply_markup=language_keyboard())


@router.message(ProfileStates.choosing_language)
async def choose_language(message: Message, state: FSMContext) -> None:
    lang = _detect_language(message.text or "")
    if not lang:
        await message.answer(t("uz", "choose_language_first"), reply_markup=language_keyboard())
        return

    await state.update_data(language=lang, social_platforms=[])
    await state.set_state(ProfileStates.waiting_for_mission_start)
    await message.answer(t(lang, "language_saved"), reply_markup=ReplyKeyboardRemove())
    await message.answer(
        t(lang, "mission_intro"),
        reply_markup=mission_start_keyboard(lang),
    )


@router.callback_query(ProfileStates.waiting_for_mission_start, F.data == "mission:start_registration")
async def start_registration_after_mission(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    await callback.answer()
    await callback.message.edit_reply_markup()
    await state.set_state(ProfileStates.waiting_for_name)
    await callback.message.answer(t(lang, "ask_name"), reply_markup=ReplyKeyboardRemove())


@router.message(ProfileStates.waiting_for_mission_start)
async def mission_waiting_input(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    await message.answer(t(lang, "mission_button_hint"), reply_markup=mission_start_keyboard(lang))


@router.message(ProfileStates.waiting_for_name)
async def handle_name(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    full_name = (message.text or "").strip()
    if not full_name or _looks_like_non_name(full_name):
        await message.answer(t(lang, "name_invalid"), reply_markup=ReplyKeyboardRemove())
        return

    await state.update_data(full_name=full_name)
    await ask_for_contact(message, state, lang, full_name)


@router.message(ProfileStates.waiting_for_contact, F.contact)
async def handle_contact(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    name = data["full_name"]

    if not message.contact:
        await message.answer(t(lang, "contact_invalid", name=name))
        return

    if message.contact.user_id and message.contact.user_id != message.from_user.id:
        await message.answer(t(lang, "contact_mismatch", name=name))
        return

    await state.update_data(phone_number=message.contact.phone_number)
    await message.answer("✅", reply_markup=ReplyKeyboardRemove())
    await ask_social_usage(message, state, lang)


@router.message(ProfileStates.waiting_for_contact)
async def handle_contact_invalid(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    await message.answer(
        t(data["language"], "contact_invalid", name=data["full_name"]),
        reply_markup=contact_keyboard(data["language"]),
    )


@router.callback_query(ProfileStates.waiting_for_social_usage, F.data.startswith("social_usage:"))
async def handle_social_usage(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    usage = callback.data.split(":")[1]
    await callback.answer()
    await callback.message.edit_reply_markup()

    if usage == "yes":
        await state.update_data(uses_social_media=1)
        await ask_social_platforms(callback.message, state, lang)
        return

    await state.update_data(uses_social_media=0, social_platforms=[], daily_social_time=None)
    await ask_goal(callback.message, state, lang)


@router.callback_query(ProfileStates.waiting_for_social_usage, F.data == "skip:social_usage")
async def skip_social_usage(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    await callback.answer()
    await state.update_data(uses_social_media=None, social_platforms=[], daily_social_time=None)
    await callback.message.edit_reply_markup()
    await callback.message.answer(t(lang, "skipped"))
    await ask_goal(callback.message, state, lang)


@router.callback_query(ProfileStates.waiting_for_social_platforms, F.data.startswith("platform:"))
async def handle_social_platforms(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    action = callback.data.split(":")[1]
    selected = set(data.get("social_platforms", []))

    if action == "continue":
        if not selected:
            await callback.answer(t(lang, "need_platform"), show_alert=True)
            return
        await callback.answer()
        await callback.message.edit_reply_markup()
        await ask_social_time(callback.message, state, lang)
        return

    if action in selected:
        selected.remove(action)
    else:
        selected.add(action)

    await state.update_data(social_platforms=list(selected))
    await callback.answer()
    await callback.message.edit_reply_markup(reply_markup=social_platforms_keyboard(lang, selected))


@router.callback_query(ProfileStates.waiting_for_social_platforms, F.data == "skip:social_platforms")
async def skip_social_platforms(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    await callback.answer()
    await state.update_data(social_platforms=[], daily_social_time=None)
    await callback.message.edit_reply_markup()
    await callback.message.answer(t(lang, "skipped"))
    await ask_goal(callback.message, state, lang)


@router.callback_query(ProfileStates.waiting_for_social_time, F.data.startswith("social_time:"))
async def handle_social_time(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    await callback.answer()
    await state.update_data(daily_social_time=callback.data.split(":")[1])
    await callback.message.edit_reply_markup()
    await ask_goal(callback.message, state, lang)


@router.callback_query(ProfileStates.waiting_for_social_time, F.data == "skip:social_time")
async def skip_social_time(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    lang = data["language"]
    await callback.answer()
    await state.update_data(daily_social_time=None)
    await callback.message.edit_reply_markup()
    await callback.message.answer(t(lang, "skipped"))
    await ask_goal(callback.message, state, lang)


@router.message(ProfileStates.waiting_for_goal)
async def handle_goal(message: Message, state: FSMContext, db: Database, config: Config) -> None:
    data = await state.get_data()
    lang = data["language"]
    name = data["full_name"]
    goal_text = (message.text or "").strip()

    if not goal_text or _looks_like_non_name(goal_text):
        await message.answer(t(lang, "goal_invalid", name=name))
        return

    await state.update_data(user_goal=goal_text)
    await finish_profile(message, state, db, config)
