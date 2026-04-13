from __future__ import annotations

from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from aiogram import Bot
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger

from app.database.sqlite import Database
from app.utils.texts import t


TIMEZONE = ZoneInfo("Asia/Tashkent")


def parse_free_time_range(value: str) -> tuple[str, int, int]:
    cleaned = value.strip()
    start, _, _ = cleaned.partition("-")
    hours_str, minutes_str = start.strip().split(":")
    hours = int(hours_str)
    minutes = int(minutes_str)
    if not (0 <= hours <= 23 and 0 <= minutes <= 59):
        raise ValueError("Invalid time")

    reminder_dt = datetime(2000, 1, 1, hours, minutes, tzinfo=TIMEZONE) + timedelta(minutes=20)
    return cleaned, reminder_dt.hour, reminder_dt.minute


async def send_smart_notification(bot: Bot, db: Database, user_id: int) -> None:
    user = await db.get_user_by_id(user_id)
    if not user or int(user["is_holiday"]) == 1:
        return
    await bot.send_message(
        chat_id=user_id,
        text=t(user["language"] or "uz", "smart_notification", name=user["full_name"]),
    )


async def send_focus_completed(bot: Bot, db: Database, user_id: int) -> None:
    user = await db.get_user_by_id(user_id)
    if not user:
        return
    await bot.send_message(
        chat_id=user_id,
        text=t(user["language"] or "uz", "focus_finished", name=user["full_name"]),
    )


async def send_weekly_reports(bot: Bot, db: Database) -> None:
    users = await db.list_active_users()
    today = date.today()
    week_start = (today - timedelta(days=6)).isoformat()
    week_end = today.isoformat()

    for user in users:
        if int(user["is_holiday"]) == 1:
            continue
        lessons = await db.count_weekly_lessons(user["user_id"], week_start, week_end)
        saved_hours = round((lessons * 25) / 60, 1)
        await bot.send_message(
            chat_id=user["user_id"],
            text=t(
                user["language"] or "uz",
                "weekly_report",
                name=user["full_name"],
                lessons=lessons,
                hours=saved_hours,
            ),
        )


def schedule_daily_notification(
    scheduler: AsyncIOScheduler,
    bot: Bot,
    db: Database,
    user_id: int,
    free_time: str,
) -> None:
    _, hour, minute = parse_free_time_range(free_time)
    scheduler.add_job(
        send_smart_notification,
        trigger=CronTrigger(hour=hour, minute=minute, timezone=TIMEZONE),
        kwargs={"bot": bot, "db": db, "user_id": user_id},
        id=f"smart_notification_{user_id}",
        replace_existing=True,
    )


def remove_daily_notification(scheduler: AsyncIOScheduler, user_id: int) -> None:
    job_id = f"smart_notification_{user_id}"
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)


def schedule_focus_timer(
    scheduler: AsyncIOScheduler,
    bot: Bot,
    db: Database,
    user_id: int,
) -> None:
    run_date = datetime.now(TIMEZONE) + timedelta(minutes=25)
    scheduler.add_job(
        send_focus_completed,
        trigger=DateTrigger(run_date=run_date),
        kwargs={"bot": bot, "db": db, "user_id": user_id},
        id=f"focus_timer_{user_id}",
        replace_existing=True,
    )


async def restore_daily_notifications(scheduler: AsyncIOScheduler, bot: Bot, db: Database) -> None:
    users = await db.list_users_with_free_time()
    for user in users:
        if int(user["is_holiday"]) == 1:
            continue
        schedule_daily_notification(scheduler, bot, db, user["user_id"], user["user_free_time"])


def schedule_weekly_reports(scheduler: AsyncIOScheduler, bot: Bot, db: Database) -> None:
    scheduler.add_job(
        send_weekly_reports,
        trigger=CronTrigger(day_of_week="sun", hour=20, minute=0, timezone=TIMEZONE),
        kwargs={"bot": bot, "db": db},
        id="weekly_reports",
        replace_existing=True,
    )
