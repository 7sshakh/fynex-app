import asyncio
import logging
import os

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.types import KeyboardButton, Message, ReplyKeyboardMarkup, ReplyKeyboardRemove
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

    contact_keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="📱 Raqamni yuborish", request_contact=True)]],
        resize_keyboard=True,
        one_time_keyboard=True,
        input_field_placeholder="Telefon raqamingizni yuboring",
    )

    @dp.message(Command("start"))
    async def start_plain(message: Message) -> None:
        await message.answer(
            "Salom! Fynex ilovasiga kirish uchun telefon raqamingizni <b>Share Contact</b> orqali yuboring.\n\n"
            "Bot sizga 5 daqiqa amal qiladigan 6 xonali OTP kod beradi.",
            reply_markup=contact_keyboard,
        )

    @dp.message(Command("code"))
    async def new_code(message: Message) -> None:
        await message.answer(
            "Yangi OTP kod olish uchun pastdagi tugma orqali telefon raqamingizni yuboring.",
            reply_markup=contact_keyboard,
        )

    @dp.message(Command("help"))
    async def help_handler(message: Message) -> None:
        await message.answer(
            "1) Bu botda telefon raqamingizni yuboring\n"
            "2) 6 xonali OTP kodni oling\n"
            "3) Fynex ilovasida raqam va kodni kiriting",
            reply_markup=contact_keyboard,
        )

    @dp.message(F.contact)
    async def contact_handler(message: Message) -> None:
        contact = message.contact
        user = message.from_user
        if not contact:
            return
        if user and contact.user_id and contact.user_id != user.id:
            await message.answer(
                "Iltimos, o'zingizning telefon raqamingizni yuboring.",
                reply_markup=contact_keyboard,
            )
            return

        phone_raw = contact.phone_number or ""
        # Normalize phone number to international format
        digits = "".join(ch for ch in phone_raw if ch.isdigit())

        if digits.startswith("998"):
            phone = f"+{digits}"
            country_flag = "🇺🇿"
        elif digits.startswith("7"):
            phone = f"+7{digits[1:]}" if len(digits) > 1 else "+7"
            country_flag = "🇷🇺"
        elif digits.startswith("996"):
            phone = f"+{digits}"
            country_flag = "🇰🇬"
        elif len(digits) == 9:
            phone = f"+998{digits}"
            country_flag = "🇺🇿"
        elif len(digits) == 10 and digits.startswith("9"):
            phone = f"+998{digits}"
            country_flag = "🇺🇿"
        else:
            phone = f"+998{digits}" if len(digits) == 9 else f"+{digits}"
            country_flag = "🌏"

        is_valid = False
        if phone.startswith("+998") and len(phone) == 13:
            is_valid = True
        elif phone.startswith("+7") and len(phone) == 12:
            is_valid = True
        elif phone.startswith("+996") and len(phone) == 13:
            is_valid = True

        if not is_valid:
            await message.answer(
                "Raqam formati noto'g'ri. Iltimos, qaytadan yuboring.",
                reply_markup=contact_keyboard,
            )
            return

        code = _generate_otp()
        telegram_id = user.id if user else None
        logging.info(f"OTP Bot - Phone: {phone}, Code: {code}, Telegram ID: {telegram_id}")
        await db.save_otp_code(phone, code, telegram_id, ttl_seconds=300)
        await message.answer(
            f"🔐 <b>Fynex OTP kodi</b>\n\n"
            f"{country_flag} Raqam: <code>{phone}</code>\n"
            f"🔢 Kod: <code>{code}</code>\n\n"
            f"Kod 5 daqiqa davomida amal qiladi.",
            reply_markup=ReplyKeyboardRemove(),
        )

    @dp.message(F.text)
    async def fallback(message: Message) -> None:
        await message.answer(
            "OTP olish uchun pastdagi tugma orqali telefon raqamingizni yuboring yoki /start bosib davom eting.",
            reply_markup=contact_keyboard,
        )

    try:
        await dp.start_polling(bot)
    finally:
        await db.close()
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(run_otp_bot())