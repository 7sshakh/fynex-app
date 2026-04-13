import asyncio
import logging
from datetime import datetime
from zoneinfo import ZoneInfo

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import BotCommand, MenuButtonCommands, MenuButtonWebApp, WebAppInfo
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import load_config
from app.database.sqlite import Database
from app.handlers.courses import router as courses_router
from app.handlers.productivity import router as productivity_router
from app.handlers.start import router as start_router
from app.services.scheduler import restore_daily_notifications, schedule_weekly_reports


async def _notify_admin_startup(bot: Bot, admin_id: int | None, web_app_url: str | None) -> None:
    if admin_id is None:
        return

    started_at = datetime.now(ZoneInfo("Asia/Tashkent")).strftime("%Y-%m-%d %H:%M:%S")
    lines = [
        "<b>Fynex bot ishga tushdi.</b>",
        f"🕒 Start vaqti: <code>{started_at}</code>",
    ]
    if web_app_url:
        lines.append(f"🌐 Web App: <code>{web_app_url}</code>")

    try:
        await bot.send_message(admin_id, "\n".join(lines))
    except Exception:
        logging.exception("Admin startup xabarini yuborib bo'lmadi.")


async def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )

    config = load_config()
    database = Database(config.database_path)
    await database.connect()
    await database.create_tables()
    scheduler = AsyncIOScheduler(timezone=ZoneInfo("Asia/Tashkent"))

    bot = Bot(
        token=config.bot_token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    dp = Dispatcher()
    dp["db"] = database
    dp["config"] = config
    dp["scheduler"] = scheduler
    dp.include_router(start_router)
    dp.include_router(courses_router)
    dp.include_router(productivity_router)
    scheduler.start()
    await restore_daily_notifications(scheduler, bot, database)
    schedule_weekly_reports(scheduler, bot, database)
    await bot.set_my_commands(
        [
            BotCommand(command="start", description="Botni qayta ochish"),
            BotCommand(command="lesson", description="Bugungi darsni ochish"),
            BotCommand(command="stats", description="Zanjir va natijalarni ko'rish"),
        ]
    )
    if config.web_app_url:
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(
                text="Open",
                web_app=WebAppInfo(url=f"{config.web_app_url.rstrip('/')}/?view=dashboard"),
            )
        )
    else:
        await bot.set_chat_menu_button(menu_button=MenuButtonCommands())
    await _notify_admin_startup(bot, config.admin_id, config.web_app_url)

    try:
        await dp.start_polling(bot)
    finally:
        scheduler.shutdown(wait=False)
        await database.close()
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
