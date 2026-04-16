import asyncio
import logging
import os

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command, CommandObject, CommandStart
from aiogram.types import Message
from dotenv import load_dotenv

from app.database.sqlite import Database


load_dotenv()


def _generate_otp() -> str:
    return f"{int.from_bytes(os.urandom(2), 'big') % 900000 + 100000:06d}"


async def run_otp_bot() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(name)s | %(message)s")
    token = os.getenv("DATA_BOT_TOKEN", "").strip()
    if not token:
        raise ValueError("DATA_BOT_TOKEN topilmadi. .env ga qo'shing.")

    db_path = os.getenv("DATABASE_PATH", "fynex.db").strip() or "fynex.db"
    db = Database(db_path)
    await db.connect()
    await db.create_tables()

    bot = Bot(token=token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()

    @dp.message(CommandStart(deep_link=True))
    async def start_with_payload(message: Message, command: CommandObject) -> None:
        payload = (command.args or "").strip()
        if not payload.startswith("otp_"):
            await message.answer(
                "Salom. OTP olish uchun ilovadagi <b>Kodni Telegramdan oling</b> tugmasidan foydalaning."
            )
            return

        phone_digits = payload.removeprefix("otp_").replace("+", "")
        if not phone_digits.startswith("998"):
            await message.answer("Raqam formati noto'g'ri. Ilovadan qayta urinib ko'ring.")
            return
        phone = f"+{phone_digits}"
        if not phone.startswith("+998") or len(phone) != 13:
            await message.answer("Raqam formati noto'g'ri. Ilovadan qayta urinib ko'ring.")
            return

        code = _generate_otp()
        telegram_id = message.from_user.id if message.from_user else None
        await db.save_otp_code(phone, code, telegram_id, ttl_seconds=120)
        await message.answer(
            f"🔐 <b>Fynex OTP kodi</b>\n\n"
            f"📱 Raqam: <code>{phone}</code>\n"
            f"🔢 Kod: <code>{code}</code>\n\n"
            f"Kod 2 daqiqa davomida amal qiladi."
        )

    @dp.message(Command("start"))
    async def start_plain(message: Message) -> None:
        await message.answer(
            "Salom. OTP olish uchun Fynex ilovasidan <b>Kodni Telegramdan oling</b> tugmasini bosing."
        )

    @dp.message(Command("help"))
    async def help_handler(message: Message) -> None:
        await message.answer(
            "1) Fynex login sahifasida raqam kiriting\n"
            "2) <b>Kodni Telegramdan oling</b> tugmasini bosing\n"
            "3) Bu yerga kelgan kodni ilovaga kiriting"
        )

    @dp.message(F.text)
    async def fallback(message: Message) -> None:
        await message.answer("OTP uchun ilovadagi tugmadan kiring. Bu bot faqat tasdiqlash kodini beradi.")

    try:
        await dp.start_polling(bot)
    finally:
        await db.close()
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(run_otp_bot())
