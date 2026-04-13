from __future__ import annotations

import json
import re

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import Config
from app.database.sqlite import Database
from app.keyboards.inline import focus_keyboard, settings_keyboard, web_app_entry_keyboard
from app.keyboards.reply import main_menu_keyboard
from app.services.scheduler import (
    parse_free_time_range,
    remove_daily_notification,
    schedule_daily_notification,
    schedule_focus_timer,
)
from app.services.webapp_link import build_webapp_url
from app.states.profile import ProfileStates
from app.utils.texts import COURSES, MAIN_MENU_BUTTONS, t

router = Router()

SETTINGS_BUTTONS = set(MAIN_MENU_BUTTONS["settings"].values())
FOCUS_BUTTONS = set(MAIN_MENU_BUTTONS["focus"].values())
RESULTS_BUTTONS = set(MAIN_MENU_BUTTONS["results"].values())


def _social_hours_per_day(value: str | None) -> int:
    if not value:
        return 0
    normalized = value.lower()
    if "4+" in normalized:
        return 4
    if "2-3" in normalized or "2" in normalized or "3" in normalized:
        return 3
    if "1" in normalized:
        return 1
    return 0


def _is_admin(user_id: int, config: Config) -> bool:
    return config.admin_id is not None and user_id == config.admin_id


async def _send_webapp_prompt(
    message: Message,
    db: Database,
    config: Config,
    view: str,
    text_key: str,
) -> None:
    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    lang = user["language"] or "uz"
    if not config.web_app_url:
        await message.answer(t(lang, "menu_placeholder", name=user["full_name"]))
        return

    web_app_url = await build_webapp_url(config.web_app_url, view, db, message.from_user.id)
    await message.answer(
        t(lang, text_key, name=user["full_name"]),
        reply_markup=web_app_entry_keyboard(lang, web_app_url),
    )


def _progress_tier(total_lessons: int) -> tuple[str, int, float]:
    if total_lessons >= 30:
        return "Elite", 92, 1.8
    if total_lessons >= 15:
        return "Builder", 85, 1.4
    if total_lessons >= 5:
        return "Starter", 72, 1.2
    return "Awakening", 60, 1.05


@router.message(F.text.func(lambda text: bool(text and text in SETTINGS_BUTTONS)))
async def open_settings(message: Message, db: Database, config: Config) -> None:
    if config.web_app_url:
        await _send_webapp_prompt(message, db, config, "settings", "settings_webapp_prompt")
        return

    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    lang = user["language"] or "uz"
    await message.answer(
        t(lang, "settings_intro", name=user["full_name"]),
        reply_markup=settings_keyboard(lang),
    )


@router.callback_query(F.data == "settings:set_free_time")
async def start_free_time_input(callback: CallbackQuery, state: FSMContext, db: Database) -> None:
    user = await db.get_user_by_id(callback.from_user.id)
    if not user:
        await callback.answer()
        return

    lang = user["language"] or "uz"
    await state.set_state(ProfileStates.waiting_for_free_time)
    await callback.answer()
    await callback.message.edit_reply_markup()
    await callback.message.answer(t(lang, "ask_free_time", name=user["full_name"]))


@router.callback_query(F.data == "settings:holiday_toggle")
async def toggle_holiday(
    callback: CallbackQuery,
    db: Database,
    scheduler: AsyncIOScheduler,
    config: Config,
) -> None:
    user = await db.get_user_by_id(callback.from_user.id)
    if not user:
        await callback.answer()
        return

    lang = user["language"] or "uz"
    await callback.answer()
    state = await db.toggle_holiday_mode(callback.from_user.id)
    updated_user = await db.get_user_by_id(callback.from_user.id)
    assert updated_user is not None

    if state == 1:
        remove_daily_notification(scheduler, callback.from_user.id)
        text = t(lang, "holiday_enabled", name=updated_user["full_name"])
    else:
        if updated_user["user_free_time"]:
            schedule_daily_notification(scheduler, callback.bot, db, callback.from_user.id, updated_user["user_free_time"])
        text = t(lang, "holiday_disabled", name=updated_user["full_name"])

    await callback.message.answer(
        text,
        reply_markup=main_menu_keyboard(
            lang,
            is_admin=_is_admin(callback.from_user.id, config),
            web_app_url=config.web_app_url,
        ),
    )


@router.message(ProfileStates.waiting_for_free_time)
async def save_free_time(
    message: Message,
    state: FSMContext,
    db: Database,
    scheduler: AsyncIOScheduler,
    bot,
    config: Config,
) -> None:
    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    lang = user["language"] or "uz"
    name = user["full_name"]
    value = (message.text or "").strip()

    if not re.fullmatch(r"\d{2}:\d{2}-\d{2}:\d{2}", value):
        await message.answer(t(lang, "free_time_invalid", name=name))
        return

    try:
        normalized, _, _ = parse_free_time_range(value)
    except Exception:
        await message.answer(t(lang, "free_time_invalid", name=name))
        return

    await db.update_user_free_time(message.from_user.id, normalized)
    schedule_daily_notification(scheduler, bot, db, message.from_user.id, normalized)
    await state.clear()
    await message.answer(
        t(lang, "free_time_saved", name=name, free_time=normalized),
        reply_markup=main_menu_keyboard(
            lang,
            is_admin=_is_admin(message.from_user.id, config),
            web_app_url=config.web_app_url,
        ),
    )


@router.message(F.text.func(lambda text: bool(text and text in FOCUS_BUTTONS)))
async def open_focus_mode(message: Message, db: Database, config: Config) -> None:
    if config.web_app_url:
        await _send_webapp_prompt(message, db, config, "focus", "focus_webapp_prompt")
        return

    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return
    lang = user["language"] or "uz"
    await message.answer(
        t(lang, "focus_intro", name=user["full_name"]),
        reply_markup=focus_keyboard(lang),
    )


@router.message(Command("stats"))
async def slash_stats(message: Message, db: Database) -> None:
    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    lang = user["language"] or "uz"
    streak_count = await db.get_streak_count(message.from_user.id)
    lessons = await db.count_completed_lessons(message.from_user.id)
    focus_minutes = await db.count_focus_minutes(message.from_user.id)
    await message.answer(
        t(
            lang,
            "stats_message",
            name=user["full_name"],
            streak_count=streak_count,
            lessons=lessons,
            focus_minutes=focus_minutes,
        )
    )


@router.callback_query(F.data == "focus:start")
async def start_focus_mode(callback: CallbackQuery, db: Database, scheduler: AsyncIOScheduler) -> None:
    user = await db.get_user_by_id(callback.from_user.id)
    if not user:
        await callback.answer()
        return
    lang = user["language"] or "uz"
    await callback.answer()
    await callback.message.edit_reply_markup()
    schedule_focus_timer(scheduler, callback.bot, db, callback.from_user.id)
    await callback.message.answer(t(lang, "focus_started", name=user["full_name"]))


@router.message(F.text.func(lambda text: bool(text and text in RESULTS_BUTTONS)))
async def show_results(message: Message, db: Database, config: Config) -> None:
    if config.web_app_url:
        await _send_webapp_prompt(message, db, config, "results", "results_webapp_prompt")
        return

    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    lang = user["language"] or "uz"
    name = user["full_name"]
    daily_hours = _social_hours_per_day(user["daily_social_time"])
    primary_course = await db.get_primary_course(message.from_user.id)
    total_lessons = await db.count_completed_lessons(message.from_user.id)

    if daily_hours == 0:
        await message.answer(
            t(lang, "results_missing", name=name),
            reply_markup=main_menu_keyboard(
                lang,
                is_admin=_is_admin(message.from_user.id, config),
                web_app_url=config.web_app_url,
            ),
        )
        return

    subject = COURSES[primary_course["subject"]][lang] if primary_course else "Fynex"
    yearly_hours = daily_hours * 365
    level_name, percent, power = _progress_tier(total_lessons)
    text = "\n\n".join(
        [
            t(lang, "results_header", name=name),
            t(lang, "results_body", daily_hours=daily_hours, yearly_hours=yearly_hours, subject=subject),
            t(lang, "results_level", level_name=level_name, percent=percent),
            t(lang, "results_compare", power=power),
            t(lang, "results_footer", goal=user["user_goal"] or "Aniq maqsad hali belgilanmagan"),
        ]
    )
    await message.answer(
        text,
        reply_markup=main_menu_keyboard(
            lang,
            is_admin=_is_admin(message.from_user.id, config),
            web_app_url=config.web_app_url,
        ),
    )


async def message_or_answer(message: Message, text: str, reply_markup) -> None:
    await message.answer(text, reply_markup=reply_markup)


@router.message(F.web_app_data)
async def handle_web_app_data(
    message: Message,
    db: Database,
    scheduler: AsyncIOScheduler,
    config: Config,
) -> None:
    if not message.web_app_data:
        return

    raw_data = message.web_app_data.data.strip()
    if raw_data == "Focus_Complete":
        user = await db.get_user_by_id(message.from_user.id)
        if not user:
            return
        await db.add_focus_session(message.from_user.id, 25)
        return

    try:
        payload = json.loads(raw_data)
    except json.JSONDecodeError:
        return

    user = await db.get_user_by_id(message.from_user.id)
    if not user:
        return

    action = payload.get("action")
    if action == "select_course":
        subject = str(payload.get("subject", "")).strip().lower()
        level = str(payload.get("level") or "zero").strip().lower()
        if subject not in {"english", "math", "programming", "russian", "logic", "physics"}:
            return
        if subject != "english":
            level = "zero"
        await db.ensure_course_progress(message.from_user.id, subject, level)
        return

    if action == "lesson_done":
        subject = str(payload.get("subject", "")).strip().lower()
        if subject:
            try:
                await db.complete_lesson(message.from_user.id, subject)
            except ValueError:
                return
        return

    if action == "focus_done":
        minutes = int(payload.get("minutes") or 25)
        await db.add_focus_session(message.from_user.id, minutes)
        return

    if action == "set_free_time":
        free_time = str(payload.get("free_time", "")).strip()
        if not re.fullmatch(r"\d{2}:\d{2}-\d{2}:\d{2}", free_time):
            return
        normalized, _, _ = parse_free_time_range(free_time)
        await db.update_user_free_time(message.from_user.id, normalized)
        if not int(user["is_holiday"] or 0):
            schedule_daily_notification(scheduler, message.bot, db, message.from_user.id, normalized)
        return

    if action == "set_language":
        language = str(payload.get("language", "")).strip().lower()
        if language not in {"uz", "en", "ru"}:
            return
        await db.update_user_language(message.from_user.id, language)
        return

    if action == "toggle_holiday":
        desired_state = 1 if payload.get("is_holiday") else 0
        current_state = int(user["is_holiday"] or 0)
        if desired_state == current_state:
            return
        state = await db.toggle_holiday_mode(message.from_user.id)
        if state == 1:
            remove_daily_notification(scheduler, message.from_user.id)
        elif user["user_free_time"]:
            schedule_daily_notification(scheduler, message.bot, db, message.from_user.id, user["user_free_time"])
