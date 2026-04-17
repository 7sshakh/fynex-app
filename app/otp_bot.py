import asyncio
import logging
import os

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.types import KeyboardButton, Message, ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardMarkup, InlineKeyboardButton
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

    country_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🇺🇿 O'zbekiston (+998)", callback_data="country_uz")],
            [InlineKeyboardButton(text="🇷🇺 Rossiya (+7)", callback_data="country_ru")],
            [InlineKeyboardButton(text="🇰🇬 Qirg'iziston (+996)", callback_data="country_kg")],
            [InlineKeyboardButton(text="🇰🇿 Qozog'iston (+7)", callback_data="country_kz")],
        ]
    )

    selected_country = {"code": "+998", "name": "O'zbekiston", "flag": "🇺🇿"}

    @dp.message(Command("start"))
    async def start_plain(message: Message) -> None:
        selected_country["code"] = "+998"
        selected_country["name"] = "O'zbekiston"
        selected_country["flag"] = "🇺🇿"
        await message.answer(
            f"Salom! Fynex ilovasiga kirish uchun davlatingizni tanlang, so'ngra telefon raqamingizni <b>Share Contact</b> orqali yuboring.\n\n"
            f"Bot sizga 5 daqiqa amal qiladigan 6 xonali OTP kod beradi.",
            reply_markup=country_keyboard,
        )

    @dp.callback_query(F.data.startswith("country_"))
    async def country_callback(callback: Message) -> None:
        country_code = callback.data.replace("country_", "")
        if country_code == "uz":
            selected_country["code"] = "+998"
            selected_country["name"] = "O'zbekiston"
            selected_country["flag"] = "🇺🇿"
        elif country_code == "ru":
            selected_country["code"] = "+7"
            selected_country["name"] = "Rossiya"
            selected_country["flag"] = "🇷🇺"
        elif country_code == "kg":
            selected_country["code"] = "+996"
            selected_country["name"] = "Qirg'iziston"
            selected_country["flag"] = "🇰🇬"
        elif country_code == "kz":
            selected_country["code"] = "+7"
            selected_country["name"] = "Qozog'iston"
            selected_country["flag"] = "🇰🇿"
        await callback.message.answer(
            f"{selected_country['flag']} <b>{selected_country['name']}</b> tanlandi.\n\n"
            f"Endi telefon raqamingizni <b>Share Contact</b> orqali yuboring.",
            reply_markup=contact_keyboard,
        )
        await callback.answer()

    @dp.message(Command("help"))
    async def help_handler(message: Message) -> None:
        await message.answer(
            "1) Bu botda telefon raqamingizni yuboring\n"
            "2) 6 xonali OTP kodni oling\n"
            "3) Fynex ilovasida raqam va kodni kiriting",
            reply_markup=country_keyboard,
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

        country_code = selected_country.get("code", "+998")
        digits = "".join(ch for ch in (contact.phone_number or "") if ch.isdigit())

        phone = f"{country_code}{digits[-9:]}" if country_code == "+998" or country_code == "+996" else f"{country_code}{digits[-10:]}"

        is_valid = False
        if country_code == "+998" and len(phone) == 13:
            is_valid = True
        elif country_code == "+7" and len(phone) == 12:
            is_valid = True
        elif country_code == "+996" and len(phone) == 13:
            is_valid = True

        if not is_valid:
            await message.answer(
                f"Raqam formati noto'g'ri. Iltimos, {selected_country.get('name', 'Ozbekiston')} raqamini qaytadan yuboring.",
                reply_markup=contact_keyboard,
            )
            return

        code = _generate_otp()
        telegram_id = user.id if user else None
        await db.save_otp_code(phone, code, telegram_id, ttl_seconds=300)
        await message.answer(
            f"🔐 <b>Fynex OTP kodi</b>\n\n"
            f"📱 Raqam: <code>{phone}</code>\n"
            f"🔢 Kod: <code>{code}</code>\n\n"
            f"Kod 5 daqiqa davomida amal qiladi.",
            reply_markup=ReplyKeyboardRemove(),
        )

    @dp.message(F.text)
    async def fallback(message: Message) -> None:
        await message.answer(
            "OTP olish uchun pastdagi tugma orqali telefon raqamingizni yuboring yoki /start bosib davom eting.",
            reply_markup=country_keyboard,
        )

    try:
        await dp.start_polling(bot)
    finally:
        await db.close()
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(run_otp_bot())