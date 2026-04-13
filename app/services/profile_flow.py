from __future__ import annotations

from aiogram.fsm.context import FSMContext
from aiogram.types import Message, ReplyKeyboardRemove

from app.config import Config
from app.database.sqlite import Database
from app.keyboards.inline import social_platforms_keyboard, social_time_keyboard, yes_no_keyboard
from app.keyboards.reply import contact_keyboard, main_menu_keyboard
from app.states.profile import ProfileStates
from app.utils.texts import SOCIAL_PLATFORMS, SOCIAL_TIMES, t


async def ask_for_contact(message: Message, state: FSMContext, lang: str, name: str) -> None:
    await state.set_state(ProfileStates.waiting_for_contact)
    await message.answer(t(lang, "privacy_note"))
    await message.answer(
        t(lang, "ask_contact", name=name),
        reply_markup=contact_keyboard(lang),
    )


async def ask_social_usage(message: Message, state: FSMContext, lang: str) -> None:
    await state.set_state(ProfileStates.waiting_for_social_usage)
    data = await state.get_data()
    await message.answer(
        t(lang, "ask_social_usage", name=data["full_name"]),
        reply_markup=yes_no_keyboard(lang),
    )


async def ask_social_platforms(message: Message, state: FSMContext, lang: str) -> None:
    await state.set_state(ProfileStates.waiting_for_social_platforms)
    data = await state.get_data()
    selected = set(data.get("social_platforms", []))
    await message.answer(
        f"{t(lang, 'ask_social_platforms', name=data['full_name'])}\n\n{t(lang, 'social_platform_hint')}",
        reply_markup=social_platforms_keyboard(lang, selected),
    )


async def ask_social_time(message: Message, state: FSMContext, lang: str) -> None:
    await state.set_state(ProfileStates.waiting_for_social_time)
    data = await state.get_data()
    await message.answer(
        t(lang, "ask_social_time", name=data["full_name"]),
        reply_markup=social_time_keyboard(lang),
    )


async def ask_goal(message: Message, state: FSMContext, lang: str) -> None:
    await state.set_state(ProfileStates.waiting_for_goal)
    data = await state.get_data()
    await message.answer(
        t(lang, "ask_goal", name=data["full_name"]),
        reply_markup=ReplyKeyboardRemove(),
    )


async def finish_profile(message: Message, state: FSMContext, db: Database, config: Config) -> None:
    data = await state.get_data()
    lang = data["language"]
    payload = {
        "user_id": message.from_user.id,
        "language": lang,
        "full_name": data["full_name"],
        "phone_number": data.get("phone_number"),
        "uses_social_media": data.get("uses_social_media"),
        "social_platforms": [SOCIAL_PLATFORMS[item][lang] for item in data.get("social_platforms", [])],
        "daily_social_time": SOCIAL_TIMES[data["daily_social_time"]][lang] if data.get("daily_social_time") else None,
        "user_goal": data["user_goal"],
        "is_holiday": 0,
    }
    await db.upsert_user_profile(payload)
    await message.answer(
        t(lang, "summary", name=data["full_name"]),
        reply_markup=main_menu_keyboard(
            lang,
            is_admin=message.from_user.id == config.admin_id,
            web_app_url=config.web_app_url,
        ),
    )
    await state.clear()


async def show_main_menu(
    message: Message,
    lang: str,
    name: str,
    is_admin: bool = False,
    web_app_url: str | None = None,
) -> None:
    await message.answer(
        t(lang, "main_menu", name=name),
        reply_markup=main_menu_keyboard(lang, is_admin=is_admin, web_app_url=web_app_url),
    )
