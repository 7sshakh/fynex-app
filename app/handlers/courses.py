from __future__ import annotations

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message

from app.config import Config
from app.database.sqlite import Database
from app.keyboards.inline import courses_keyboard, english_levels_keyboard, lesson_complete_keyboard, web_app_entry_keyboard
from app.keyboards.reply import language_keyboard, main_menu_keyboard
from app.services.webapp_link import build_webapp_url
from app.states.profile import ProfileStates
from app.utils.texts import COURSE_LEVELS, COURSES, MAIN_MENU_BUTTONS, t

router = Router()

COURSE_BUTTONS = {value for translations in COURSES.values() for value in translations.values()}
COURSES_MENU_BUTTONS = set(MAIN_MENU_BUTTONS["courses"].values())
DAILY_LESSON_BUTTONS = set(MAIN_MENU_BUTTONS["daily_lesson"].values())
TEST_BUTTONS = set(MAIN_MENU_BUTTONS["test"].values())


def _is_admin(user_id: int, config: Config) -> bool:
    return config.admin_id is not None and user_id == config.admin_id


async def _show_lesson(
    callback_or_message: CallbackQuery | Message,
    db: Database,
    user_id: int,
    lang: str,
    name: str,
    subject: str,
    level: str,
) -> None:
    progress = await db.ensure_course_progress(user_id, subject, level)
    lesson = await db.get_lesson(subject, progress["level"], progress["current_day"])

    target = callback_or_message.message if isinstance(callback_or_message, CallbackQuery) else callback_or_message
    if lesson is None:
        await target.answer(t(lang, "lesson_missing", name=name))
        return

    lesson_text = (
        f"{t(lang, 'lesson_header', subject=COURSES[subject][lang], day=lesson['day_number'], level=COURSE_LEVELS[progress['level']][lang])}\n\n"
        f"{t(lang, 'lesson_content', content=lesson['content'], task=lesson['task'])}"
    )
    await target.answer(
        lesson_text,
        reply_markup=lesson_complete_keyboard(subject),
    )


@router.message(F.text.func(lambda text: bool(text and text in (COURSE_BUTTONS | COURSES_MENU_BUTTONS))))
async def open_courses(message: Message, db: Database, config: Config) -> None:
    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    lang = user["language"] or "uz"
    if not config.web_app_url:
        await message.answer(
            t(lang, "courses_intro", name=user["full_name"]),
            reply_markup=courses_keyboard(lang),
        )
        return

    web_app_url = await build_webapp_url(config.web_app_url, "courses", db, message.from_user.id)
    await message.answer(
        t(lang, "courses_webapp_prompt", name=user["full_name"]),
        reply_markup=web_app_entry_keyboard(lang, web_app_url),
    )


@router.message(Command("lesson"))
@router.message(F.text.func(lambda text: bool(text and text in DAILY_LESSON_BUTTONS)))
async def show_today_lesson(message: Message, db: Database) -> None:
    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    lang = user["language"] or "uz"
    primary_course = await db.get_primary_course(message.from_user.id)
    if not primary_course:
        await message.answer(
            t(lang, "lesson_choose_first", name=user["full_name"]),
            reply_markup=courses_keyboard(lang),
        )
        return

    await _show_lesson(
        message,
        db,
        message.from_user.id,
        lang,
        user["full_name"],
        primary_course["subject"],
        primary_course["level"],
    )


@router.callback_query(F.data.startswith("course:"))
async def choose_course(callback: CallbackQuery, db: Database) -> None:
    user = await db.get_user_by_id(callback.from_user.id)
    if not user:
        await callback.answer()
        return

    lang = user["language"] or "uz"
    subject = callback.data.split(":")[1]
    await callback.answer()
    await callback.message.edit_reply_markup()

    if subject == "english":
        await callback.message.answer(
            t(lang, "english_level", name=user["full_name"]),
            reply_markup=english_levels_keyboard(lang),
        )
        return

    await _show_lesson(
        callback,
        db,
        callback.from_user.id,
        lang,
        user["full_name"],
        subject,
        "zero",
    )


@router.callback_query(F.data.startswith("course_level:"))
async def choose_english_level(callback: CallbackQuery, db: Database) -> None:
    user = await db.get_user_by_id(callback.from_user.id)
    if not user:
        await callback.answer()
        return

    level = callback.data.split(":")[1]
    lang = user["language"] or "uz"
    await callback.answer()
    await callback.message.edit_reply_markup()
    await _show_lesson(
        callback,
        db,
        callback.from_user.id,
        lang,
        user["full_name"],
        "english",
        level,
    )


@router.callback_query(F.data.startswith("lesson_done:"))
async def complete_lesson(callback: CallbackQuery, db: Database, config: Config) -> None:
    user = await db.get_user_by_id(callback.from_user.id)
    if not user:
        await callback.answer()
        return

    subject = callback.data.split(":")[1]
    lang = user["language"] or "uz"
    await callback.answer()

    completed, streak_count = await db.complete_lesson(callback.from_user.id, subject)
    await callback.message.edit_reply_markup()

    if not completed:
        await callback.message.answer(t(lang, "lesson_already_done", name=user["full_name"]))
        return

    await callback.message.answer(
        t(lang, "streak_success", name=user["full_name"], streak_count=streak_count),
        reply_markup=main_menu_keyboard(
            lang,
            is_admin=_is_admin(callback.from_user.id, config),
            web_app_url=config.web_app_url,
        ),
    )


@router.message(F.text.func(lambda text: bool(text and text in TEST_BUTTONS)))
async def admin_test_reset(message: Message, db: Database, state: FSMContext, config: Config) -> None:
    if not _is_admin(message.from_user.id, config):
        await message.answer(t("uz", "admin_only"))
        return

    user = await db.get_user_by_id(message.from_user.id)
    name = user["full_name"] if user else (message.from_user.first_name or "Admin")
    lang = user["language"] if user else "uz"

    await state.clear()
    await db.reset_user(message.from_user.id)
    await state.set_state(ProfileStates.choosing_language)
    await message.answer(t(lang, "admin_reset", name=name))
    await message.answer(t("uz", "welcome"), reply_markup=language_keyboard())


@router.message(F.text == "/courses")
async def slash_courses(message: Message, db: Database, config: Config) -> None:
    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return
    await open_courses(message, db, config)
