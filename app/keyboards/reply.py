from aiogram.types import KeyboardButton, ReplyKeyboardMarkup

from app.utils.texts import CONTACT_BUTTON, LANGUAGES, MAIN_MENU_BUTTONS


def language_keyboard() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=LANGUAGES["uz"]), KeyboardButton(text=LANGUAGES["en"])],
            [KeyboardButton(text=LANGUAGES["ru"])],
        ],
        resize_keyboard=True,
        one_time_keyboard=True,
    )


def contact_keyboard(lang: str) -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=CONTACT_BUTTON[lang], request_contact=True)],
        ],
        resize_keyboard=True,
        one_time_keyboard=True,
    )


def main_menu_keyboard(lang: str, is_admin: bool = False, web_app_url: str | None = None) -> ReplyKeyboardMarkup:
    daily_lesson_button = KeyboardButton(text=MAIN_MENU_BUTTONS["daily_lesson"][lang])
    courses_button = KeyboardButton(text=MAIN_MENU_BUTTONS["courses"][lang])
    focus_button = KeyboardButton(text=MAIN_MENU_BUTTONS["focus"][lang])
    results_button = KeyboardButton(text=MAIN_MENU_BUTTONS["results"][lang])
    settings_button = KeyboardButton(text=MAIN_MENU_BUTTONS["settings"][lang])

    keyboard = [
        [
            daily_lesson_button,
            courses_button,
        ],
        [
            focus_button,
            results_button,
        ],
        [
            settings_button,
        ],
    ]
    if is_admin:
        keyboard.append([KeyboardButton(text=MAIN_MENU_BUTTONS["test"][lang])])

    return ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True,
        one_time_keyboard=False,
    )
