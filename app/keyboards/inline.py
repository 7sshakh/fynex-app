from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

from app.utils.texts import COURSE_LEVELS, COURSES, SKIP_TEXT, SOCIAL_PLATFORMS, SOCIAL_TIMES, TEXTS, YES_NO, label


def yes_no_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text=label(YES_NO, "yes", lang), callback_data="social_usage:yes"),
                InlineKeyboardButton(text=label(YES_NO, "no", lang), callback_data="social_usage:no"),
            ],
            [InlineKeyboardButton(text=SKIP_TEXT[lang], callback_data="skip:social_usage")],
        ]
    )


def social_platforms_keyboard(lang: str, selected: set[str]) -> InlineKeyboardMarkup:
    rows = []
    current_row = []
    for key in SOCIAL_PLATFORMS:
        text = label(SOCIAL_PLATFORMS, key, lang)
        if key in selected:
            text = f"✅ {text}"
        current_row.append(InlineKeyboardButton(text=text, callback_data=f"platform:{key}"))
        if len(current_row) == 2:
            rows.append(current_row)
            current_row = []
    if current_row:
        rows.append(current_row)

    rows.append([InlineKeyboardButton(text=TEXTS["continue"][lang], callback_data="platform:continue")])
    rows.append([InlineKeyboardButton(text=SKIP_TEXT[lang], callback_data="skip:social_platforms")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def social_time_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text=label(SOCIAL_TIMES, "1h", lang), callback_data="social_time:1h"),
                InlineKeyboardButton(text=label(SOCIAL_TIMES, "2_3h", lang), callback_data="social_time:2_3h"),
            ],
            [InlineKeyboardButton(text=label(SOCIAL_TIMES, "4ph", lang), callback_data="social_time:4ph")],
            [InlineKeyboardButton(text=SKIP_TEXT[lang], callback_data="skip:social_time")],
        ]
    )


def courses_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text=label(COURSES, "english", lang), callback_data="course:english"),
                InlineKeyboardButton(text=label(COURSES, "math", lang), callback_data="course:math"),
            ],
            [
                InlineKeyboardButton(text=label(COURSES, "programming", lang), callback_data="course:programming"),
                InlineKeyboardButton(text=label(COURSES, "russian", lang), callback_data="course:russian"),
            ],
            [
                InlineKeyboardButton(text=label(COURSES, "logic", lang), callback_data="course:logic"),
                InlineKeyboardButton(text=label(COURSES, "physics", lang), callback_data="course:physics"),
            ],
        ]
    )


def english_levels_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text=label(COURSE_LEVELS, "beginner", lang), callback_data="course_level:beginner"),
                InlineKeyboardButton(text=label(COURSE_LEVELS, "elementary", lang), callback_data="course_level:elementary"),
            ],
            [
                InlineKeyboardButton(text=label(COURSE_LEVELS, "intermediate", lang), callback_data="course_level:intermediate"),
                InlineKeyboardButton(text=label(COURSE_LEVELS, "advanced", lang), callback_data="course_level:advanced"),
            ],
        ]
    )


def lesson_complete_keyboard(subject: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="✅ Bajardim", callback_data=f"lesson_done:{subject}")]
        ]
    )


def settings_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=TEXTS["holiday_mode_button"][lang], callback_data="settings:holiday_toggle")],
        ]
    )


def focus_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=TEXTS["focus_start_button"][lang], callback_data="focus:start")]
        ]
    )


def secret_continue_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=TEXTS["secret_continue_button"][lang], callback_data="secret:continue")]
        ]
    )


def mission_start_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=TEXTS["mission_start_button"][lang], callback_data="mission:start_registration")]
        ]
    )


def web_app_entry_keyboard(lang: str, url: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=TEXTS["open_webapp_button"][lang], web_app=WebAppInfo(url=url))]
        ]
    )
