from __future__ import annotations

import json
import os
import re
import urllib.parse
import urllib.request
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request
from pydantic import BaseModel, Field

from app.database.sqlite import Database
from app.services.ai_tutor import (
    analyze_pronunciation,
    explain_vocabulary,
    generate_ielts_passage,
    transcribe_audio_base64,
    vosk_status,
)
from app.services.ielts_logic import (
    band_from_raw_score,
    build_certificate_payload,
    evaluate_productive_module,
    is_certificate_eligible,
    round_overall_band,
)
from app.services.rankings import DEFAULT_LOCATIONS, dynamic_bot_score, score_user
from app.services.strategy_engine import analyze_time_strategy


ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")

SUPPORTED_SUBJECTS = {"english", "math", "programming", "russian", "logic", "physics"}
ENGLISH_LEVELS = {"beginner", "elementary", "intermediate", "upper_intermediate", "advanced"}
SUBJECT_ORDER = ["english", "math", "programming", "russian", "logic", "physics"]
VERIFICATION_MESSAGE = "Ushbu foydalanuvchi 1 oy davomida faol va intizomli bo'lgani uchun tasdiqlangan."

SUPPORTED_COUNTRIES = {
    "+998": r"^\+998\d{9}$",
    "+7": r"^\+7\d{10}$",
    "+996": r"^\+996\d{9}$",
}


def _validate_phone(phone: str) -> bool:
    for prefix, pattern in SUPPORTED_COUNTRIES.items():
        if phone.startswith(prefix) and re.fullmatch(pattern, phone):
            return True
    return False


def _phone_country(phone: str) -> str:
    if phone.startswith("+998"):
        return "uz"
    elif phone.startswith("+7"):
        return "ru" if len(phone) == 12 else "kz"
    elif phone.startswith("+996"):
        return "kg"
    return "uz"

LESSON_LIBRARY = {
    ("english", "beginner"): (
        "Start with 5 simple greetings and read them aloud with confidence.",
        "Write any 3 greetings and build one short sentence.",
    ),
    ("english", "elementary"): (
        "Build a short self-introduction with your name, city and one hobby.",
        "Write 3 short sentences about yourself.",
    ),
    ("english", "intermediate"): (
        "Notice the difference between present simple and present continuous.",
        "Write one sentence for each tense.",
    ),
    ("english", "upper_intermediate"): (
        "Practice giving a clearer opinion using because, although and however.",
        "Write 3 opinion sentences with connectors.",
    ),
    ("english", "advanced"): (
        "Work on precision: write a short argument with a clear opening and conclusion.",
        "Write 4 advanced sentences on one topic.",
    ),
    ("math", "zero"): (
        "Refresh arithmetic speed with a few clean mental calculations.",
        "Solve 12 + 8, 20 - 7 and 18 / 3.",
    ),
    ("programming", "zero"): (
        "Understand what an algorithm is through a familiar daily routine.",
        "Describe making tea as a 4-step algorithm.",
    ),
    ("russian", "zero"): (
        "Repeat 3 simple Russian greetings and one short self-introduction.",
        "Write 2 short phrases using Privet or Menya zovut.",
    ),
    ("logic", "zero"): (
        "Find the pattern behind a growing number sequence.",
        "Continue 2, 4, 8, 16 with the next 2 numbers.",
    ),
    ("physics", "zero"): (
        "Explain the idea of speed in simple words.",
        "Write 1-2 sentences about what speed means.",
    ),
}


class UpdateProgressPayload(BaseModel):
    user_id: int
    action: str
    subject: str | None = None
    minutes: int | None = None


class SelectCoursePayload(BaseModel):
    user_id: int
    subject: str
    level: str | None = None


class FreeTimePayload(BaseModel):
    user_id: int
    free_time: str


class HolidayPayload(BaseModel):
    user_id: int


class LanguagePayload(BaseModel):
    user_id: int
    language: str


class IELTSGeneratePayload(BaseModel):
    user_id: int | None = None
    topic: str | None = None
    skill: str = "speaking"


class IELTSTutorAnalyzePayload(BaseModel):
    expected_text: str
    transcript: str | None = None
    audio_base64: str | None = None


class VocabularyPayload(BaseModel):
    word: str
    language: str = "uz"
    context: str | None = None


class StrategyAnalyzePayload(BaseModel):
    user_id: int
    goal_text: str
    timeframe_text: str
    daily_minutes: int = Field(default=90, ge=20, le=600)
    current_band: float = Field(default=5.0, ge=0.0, le=9.0)
    target_band: float | None = Field(default=None, ge=0.0, le=9.0)
    district: str | None = None
    region: str | None = None
    country: str | None = None


class LocationPayload(BaseModel):
    user_id: int
    district: str
    region: str
    country: str


class StartExamPayload(BaseModel):
    user_id: int
    mode: str = "practice"


class SubmitExamModulePayload(BaseModel):
    user_id: int
    module_type: str
    raw_score: int | None = Field(default=None, ge=0, le=40)
    reading_variant: str = "academic"
    prompt_text: str | None = None
    answer_text: str | None = None
    transcript: str | None = None
    audio_base64: str | None = None


class ExamSecurityPayload(BaseModel):
    user_id: int
    event_type: str = "exit"


class AdminSettingsPayload(BaseModel):
    user_id: int
    settings: dict[str, Any]


class AdminBotPayload(BaseModel):
    user_id: int
    id: int | None = None
    display_name: str
    district: str = DEFAULT_LOCATIONS["district"]
    region: str = DEFAULT_LOCATIONS["region"]
    country: str = DEFAULT_LOCATIONS["country"]
    is_verified: bool = True
    base_score: int = Field(default=20, ge=0, le=500)
    growth_rate: float = Field(default=0.5, ge=0.0, le=5.0)
    activity_days: int = Field(default=30, ge=1, le=365)


class AppRegisterPayload(BaseModel):
    user_id: int
    name: str
    phone_number: str
    language: str = "uz"


class AppOnboardingPayload(BaseModel):
    user_id: int
    name: str
    phone_number: str
    language: str = "uz"
    learning_level: str
    target_goal: str
    interests: list[str]


class AppCourseSelectPayload(BaseModel):
    user_id: int
    slug: str
    level: str | None = None


class AppAnswerPayload(BaseModel):
    user_id: int
    challenge_id: int
    option_id: int | None = None


class AppScenarioPayload(BaseModel):
    user_id: int


class ChatSendPayload(BaseModel):
    user_name: str
    user_phone: str
    user_telegram_id: int | None = None
    message: str


class ChatAIPayload(BaseModel):
    user_name: str
    user_phone: str
    user_telegram_id: int | None = None
    message: str
    history: list = []


class OTPRequestPayload(BaseModel):
    phone_number: str
    telegram_id: int | None = None


class OTPVerifyPayload(BaseModel):
    phone_number: str
    code: str


_CHAT_STORE_PATH = "/tmp/fynex_chat.json"


def _load_chat_store() -> dict:
    try:
        with open(_CHAT_STORE_PATH, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"messages": {}, "replies": {}}


def _save_chat_store(data: dict) -> None:
    with open(_CHAT_STORE_PATH, "w") as f:
        json.dump(data, f)


def _admin_id() -> int | None:
    raw = os.getenv("ADMIN_ID", "").strip()
    return int(raw) if raw else None


def _is_admin(user_id: int) -> bool:
    admin_id = _admin_id()
    return admin_id is not None and user_id == admin_id


def _support_bot_token() -> str:
    return os.getenv("SUPPORT_BOT_TOKEN", "").strip() or os.getenv("BOT_TOKEN", "").strip()


def _support_username() -> str:
    return os.getenv("SUPPORT_USERNAME", "@fynex-_assist").strip() or "@fynex-_assist"


def _telegram_send_message(bot_token: str, chat_id: int | str, text: str) -> bool:
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": str(chat_id), "text": text, "parse_mode": "HTML"}).encode()
    try:
        req = urllib.request.Request(url, data=data)
        resp = urllib.request.urlopen(req, timeout=10)
        result = json.loads(resp.read())
        return bool(result.get("ok"))
    except Exception:
        return False


def _normalize_subject(value: str | None) -> str | None:
    if not value:
        return None
    subject = value.strip().lower()
    return subject if subject in SUPPORTED_SUBJECTS else None


def _normalize_level(subject: str, value: str | None) -> str:
    if subject != "english":
        return "zero"
    level = (value or "beginner").strip().lower()
    if level not in ENGLISH_LEVELS:
        raise HTTPException(status_code=400, detail="Invalid english level")
    return level


def _level_label(level: str) -> str:
    labels = {
        "zero": "Starter",
        "beginner": "Beginner",
        "elementary": "Elementary",
        "intermediate": "Intermediate",
        "upper_intermediate": "Upper-Intermediate",
        "advanced": "Advanced",
    }
    return labels.get(level, level.title())


def _subject_label(subject: str) -> str:
    return {
        "english": "English",
        "math": "Mathematics",
        "programming": "Programming",
        "russian": "Russian",
        "logic": "Logic",
        "physics": "Physics",
    }.get(subject, subject.title())


async def _sample_lesson(db: Database, subject: str, level: str, day_number: int) -> dict:
    lesson_row = await db.get_lesson(subject, level, day_number)
    if lesson_row:
        content = lesson_row["content"]
        task = lesson_row["task"]
    else:
        content, task = LESSON_LIBRARY.get(
            (subject, level),
            (
                "Spend 5 focused minutes on one lesson and keep your notes short and clear.",
                "Write 3 short takeaways from the lesson.",
            ),
        )
    return {
        "subject": subject,
        "level": level,
        "day_number": day_number,
        "title": f"{_subject_label(subject)} Day {day_number}",
        "content": content,
        "task": task,
    }


async def _build_lesson_list(db: Database, subject: str, level: str, current_day: int) -> list[dict]:
    items: list[dict] = []
    total = max(5, current_day + 1)
    for day_number in range(1, total + 1):
        status = "done" if day_number < current_day else "current" if day_number == current_day else "locked"
        lesson = await _sample_lesson(db, subject, level, day_number)
        items.append({"day_number": day_number, "status": status, "preview": lesson["content"]})
    return items


async def _user_score_snapshot(db: Database, user_id: int) -> dict:
    completed_lessons = await db.count_completed_lessons(user_id)
    streak_count = await db.get_streak_count(user_id)
    focus_minutes = await db.count_focus_minutes(user_id)
    latest_overall_band = await db.get_latest_overall_band(user_id)
    strategy = await db.get_strategy(user_id)
    strategy_success = int((strategy or {}).get("success_rate") or 0)
    return {
        "completed_lessons": completed_lessons,
        "streak_count": streak_count,
        "focus_minutes": focus_minutes,
        "latest_overall_band": latest_overall_band,
        "strategy_success_rate": strategy_success,
        "score": score_user(
            completed_lessons=completed_lessons,
            streak_count=streak_count,
            focus_minutes=focus_minutes,
            strategy_success_rate=strategy_success,
            latest_overall_band=latest_overall_band,
        ),
    }


async def _build_leaderboard(db: Database, user_id: int, scope: str = "district") -> dict:
    user = await db.ensure_user_exists(user_id)
    district = user["district"] or DEFAULT_LOCATIONS["district"]
    region = user["region"] or DEFAULT_LOCATIONS["region"]
    country = user["country"] or DEFAULT_LOCATIONS["country"]
    settings = await db.get_admin_settings()

    board: list[dict] = []
    real_users = await db.list_users_by_scope(scope, district, region, country)
    for row in real_users:
        snapshot = await _user_score_snapshot(db, int(row["user_id"]))
        board.append(
            {
                "id": f"user-{row['user_id']}",
                "user_id": int(row["user_id"]),
                "name": row["full_name"],
                "district": row["district"],
                "region": row["region"],
                "country": row["country"],
                "score": snapshot["score"],
                "is_bot": False,
                "is_verified": True,
                "verification_message": VERIFICATION_MESSAGE,
            }
        )

    bot_limit = int(settings.get("bot_count", 8) or 8)
    bots = await db.list_bots_by_scope(scope, district, region, country, limit=bot_limit)
    for bot in bots:
        board.append(
            {
                "id": f"bot-{bot['id']}",
                "user_id": None,
                "bot_id": int(bot["id"]),
                "name": bot["display_name"],
                "district": bot["district"],
                "region": bot["region"],
                "country": bot["country"],
                "score": dynamic_bot_score(int(bot["base_score"]), float(bot["growth_rate"]), int(settings.get("bot_score_bias", 0) or 0)),
                "is_bot": True,
                "is_verified": bool(bot["is_verified"]),
                "verification_message": VERIFICATION_MESSAGE,
            }
        )

    board.sort(key=lambda item: (-item["score"], item["name"].lower()))
    for index, item in enumerate(board, start=1):
        item["rank"] = index

    my_rank = next((item["rank"] for item in board if item.get("user_id") == user_id), None)
    my_score = next((item["score"] for item in board if item.get("user_id") == user_id), 0)
    return {"scope": scope, "leaderboard": board[: max(10, bot_limit + 4)], "my_rank": my_rank, "my_score": my_score}


async def _progress_response(
    db: Database,
    *,
    user_id: int,
    lang: str | None = None,
    name: str | None = None,
    phone: str | None = None,
    goal: str | None = None,
    courses_json: str | None = None,
    subject: str | None = None,
    level: str | None = None,
    day: int | None = None,
) -> dict:
    user = await db.get_user_by_id(user_id)
    if not user:
        await db.upsert_user_profile(
            {
                "user_id": user_id,
                "language": lang or "uz",
                "full_name": name or "Fynex User",
                "phone_number": phone or "",
                "user_goal": goal or "",
                "social_platforms": [],
                "district": DEFAULT_LOCATIONS["district"],
                "region": DEFAULT_LOCATIONS["region"],
                "country": DEFAULT_LOCATIONS["country"],
            }
        )
        user = await db.get_user_by_id(user_id)
    elif name and (user["full_name"] or "").strip() in {"", "Fynex User"}:
        await db.upsert_user_profile(
            {
                "user_id": user_id,
                "language": user["language"] or lang or "uz",
                "full_name": name,
                "phone_number": user["phone_number"] or "",
                "user_goal": user["user_goal"] or goal or "",
                "social_platforms": [],
                "district": user["district"] or DEFAULT_LOCATIONS["district"],
                "region": user["region"] or DEFAULT_LOCATIONS["region"],
                "country": user["country"] or DEFAULT_LOCATIONS["country"],
                "is_holiday": int(user["is_holiday"] or 0),
            }
        )
        user = await db.get_user_by_id(user_id)
    assert user is not None

    if courses_json:
        try:
            course_items = json.loads(courses_json)
        except Exception:
            course_items = []
        for item in course_items:
            item_subject = _normalize_subject(item.get("subject"))
            if not item_subject:
                continue
            item_level = _normalize_level(item_subject, item.get("level"))
            await db.ensure_course_progress(user_id, item_subject, item_level)

    normalized_subject = _normalize_subject(subject)
    if normalized_subject and level:
        await db.ensure_course_progress(user_id, normalized_subject, _normalize_level(normalized_subject, level))

    courses = await db.list_user_courses(user_id)
    course_payloads = [
        {
            "subject": row["subject"],
            "level": row["level"],
            "current_day": int(row["current_day"]),
            "title": _subject_label(row["subject"]),
            "level_label": _level_label(row["level"]),
        }
        for row in courses
    ]
    course_payloads.sort(key=lambda item: SUBJECT_ORDER.index(item["subject"]) if item["subject"] in SUBJECT_ORDER else 999)

    current_course = None
    if normalized_subject:
        current_course = next((item for item in course_payloads if item["subject"] == normalized_subject), None)
    if not current_course and course_payloads:
        current_course = course_payloads[0]

    lesson = None
    lesson_list: list[dict] = []
    if current_course:
        current_day = int(day or current_course["current_day"])
        lesson = await _sample_lesson(db, current_course["subject"], current_course["level"], current_day)
        lesson_list = await _build_lesson_list(db, current_course["subject"], current_course["level"], current_day)

    strategy = await db.get_strategy(user_id)
    latest_certificate = await db.get_latest_certificate(user_id)
    active_exam_row = await db.get_active_exam_session(user_id)
    active_exam = await db.get_exam_session(active_exam_row["session_id"]) if active_exam_row else None
    settings = await db.get_admin_settings()
    snapshot = await _user_score_snapshot(db, user_id)

    return {
        "user_id": int(user["user_id"]),
        "language": user["language"] or "uz",
        "name": user["full_name"] or "Fynex User",
        "first_name": (user["full_name"] or "Fynex User").split()[0],
        "phone_number": user["phone_number"] or "",
        "user_goal": user["user_goal"] or "",
        "daily_social_time": user["daily_social_time"] or "",
        "user_free_time": user["user_free_time"] or "",
        "is_holiday": int(user["is_holiday"] or 0),
        "district": user["district"] or DEFAULT_LOCATIONS["district"],
        "region": user["region"] or DEFAULT_LOCATIONS["region"],
        "country": user["country"] or DEFAULT_LOCATIONS["country"],
        "daily_study_minutes": int(user["daily_study_minutes"] or (strategy or {}).get("daily_minutes") or 90),
        "target_band": float(user["target_band"] or (strategy or {}).get("target_band") or 7.0),
        "current_band": float(user["current_band"] or (strategy or {}).get("current_band") or 5.0),
        "courses": course_payloads,
        "current_course": current_course,
        "lesson": lesson,
        "lesson_list": lesson_list,
        "completed_lessons": snapshot["completed_lessons"],
        "focus_minutes": snapshot["focus_minutes"],
        "focus_time": snapshot["focus_minutes"],
        "streak": snapshot["streak_count"],
        "streak_count": snapshot["streak_count"],
        "latest_overall_band": snapshot["latest_overall_band"],
        "score_preview": snapshot["score"],
        "strategy": strategy,
        "latest_certificate": latest_certificate,
        "active_exam": active_exam,
        "is_admin": _is_admin(user_id),
        "subscription": {
            "enabled": bool(settings.get("subscription_enabled", True)),
            "monthly_price": settings.get("monthly_price", 19),
            "quarterly_price": settings.get("quarterly_price", 49),
            "yearly_price": settings.get("yearly_price", 159),
        },
    }


async def _learning_bootstrap(db: Database, user_id: int, *, lang: str | None = None, name: str | None = None) -> dict:
    user = await db.ensure_user_exists(user_id, name=name or "Fynex User", language=lang or "uz")
    progress = await db.ensure_learning_user_progress(user_id)
    current = await db.get_learning_current_state(user_id)
    courses = await db.list_learning_courses(user_id)
    lesson_bundle = await db.get_learning_lesson_bundle(user_id)
    weekly_stats = await db.get_weekly_learning_stats(user_id)
    achievements = await db.get_learning_achievements(user_id)
    leaderboard = await db.get_learning_leaderboard()
    lesson_map = await db.get_learning_lesson_map(user_id)
    review_items = await db.get_review_challenges(user_id)
    daily_quests = await db.get_daily_quests(user_id)
    custom_scenarios = await db.list_custom_scenarios(user_id)

    interests = db._load_json(user["interests_json"] if "interests_json" in user.keys() else None, [])

    return {
        "user_id": user_id,
        "registered": bool((user["full_name"] or "").strip() and (user["phone_number"] or "").strip()),
        "onboarding_completed": bool(int(current.get("onboarding_completed") or 0)),
        "profile": {
            "name": user["full_name"] or "",
            "phone_number": user["phone_number"] or "",
            "language": user["language"] or "uz",
            "learning_level": current.get("learning_level") or user["study_level"] or "",
            "target_goal": current.get("target_goal") or user["target_goal"] or "",
            "interests": db._load_json(current.get("interests_json"), interests),
            "xp": int(current.get("xp") or 0),
            "energy": int(current.get("energy") or 0),
            "streak": await db.get_streak_count(user_id),
            "latest_band": await db.get_latest_overall_band(user_id),
        },
        "courses": courses,
        "current_state": {
            "course_id": current.get("active_course_id"),
            "unit_id": current.get("active_unit_id"),
            "lesson_id": current.get("active_lesson_id"),
            "challenge_id": current.get("active_challenge_id"),
        },
        "current_lesson": lesson_bundle,
        "lesson_map": lesson_map,
        "review_items": review_items,
        "daily_quests": daily_quests,
        "custom_scenarios": custom_scenarios,
        "weekly_stats": weekly_stats,
        "achievements": achievements,
        "leaderboard": leaderboard,
    }


def _resolve_database_path() -> str:
    explicit = os.getenv("DATABASE_PATH", "").strip()
    if explicit:
        return explicit
    if os.getenv("VERCEL", "").strip():
        return "/tmp/fynex.db"
    return "fynex.db"


def create_app(*, title: str = "Fynex API") -> FastAPI:
    database_path = _resolve_database_path()
    db = Database(database_path)

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        await db.connect()
        await db.create_tables()
        yield
        await db.close()

    app = FastAPI(title=title, lifespan=lifespan)
    app.state.db = db

    @app.get("/api/progress")
    @app.get("/progress")
    async def progress(
        user_id: int = Query(...),
        lang: str | None = Query(None),
        name: str | None = Query(None),
        phone: str | None = Query(None),
        goal: str | None = Query(None),
        courses_json: str | None = Query(None),
        subject: str | None = Query(None),
        level: str | None = Query(None),
        day: int | None = Query(None),
    ) -> dict:
        return await _progress_response(
            db,
            user_id=user_id,
            lang=lang,
            name=name,
            phone=phone,
            goal=goal,
            courses_json=courses_json,
            subject=subject,
            level=level,
            day=day,
        )

    @app.get("/api/leaderboard")
    @app.get("/leaderboard")
    async def leaderboard(user_id: int = Query(...), scope: str = Query("district")) -> dict:
        safe_scope = scope if scope in {"district", "region", "country", "world"} else "district"
        return await _build_leaderboard(db, user_id, safe_scope)

    @app.post("/api/select_course")
    @app.post("/select_course")
    async def select_course(payload: SelectCoursePayload) -> dict:
        subject = _normalize_subject(payload.subject)
        if not subject:
            raise HTTPException(status_code=400, detail="Unsupported subject")
        level = _normalize_level(subject, payload.level)
        await db.ensure_user_exists(payload.user_id)
        current_course = await db.ensure_course_progress(payload.user_id, subject, level)
        courses = await db.list_user_courses(payload.user_id)
        course_payloads = [
            {"subject": row["subject"], "level": row["level"], "current_day": int(row["current_day"])}
            for row in courses
        ]
        lesson = await _sample_lesson(db, subject, current_course["level"], int(current_course["current_day"]))
        lesson_list = await _build_lesson_list(db, subject, current_course["level"], int(current_course["current_day"]))
        return {
            "ok": True,
            "courses": course_payloads,
            "current_course": {
                "subject": current_course["subject"],
                "level": current_course["level"],
                "current_day": int(current_course["current_day"]),
            },
            "lesson": lesson,
            "lesson_list": lesson_list,
        }

    @app.post("/api/update_progress")
    @app.post("/update_progress")
    async def update_progress(payload: UpdateProgressPayload) -> dict:
        user = await db.ensure_user_exists(payload.user_id)
        if payload.action == "lesson_done":
            subject = _normalize_subject(payload.subject)
            if not subject:
                raise HTTPException(status_code=400, detail="subject is required")
            completed, streak_count = await db.complete_lesson(payload.user_id, subject)
            current_course = await db.get_course_progress(payload.user_id, subject)
            if not current_course:
                raise HTTPException(status_code=404, detail="Course progress not found")
            lesson = await _sample_lesson(db, subject, current_course["level"], int(current_course["current_day"]))
            lesson_list = await _build_lesson_list(db, subject, current_course["level"], int(current_course["current_day"]))
            courses = await db.list_user_courses(payload.user_id)
            return {
                "ok": True,
                "completed": completed,
                "streak_count": streak_count,
                "current_course": {
                    "subject": current_course["subject"],
                    "level": current_course["level"],
                    "current_day": int(current_course["current_day"]),
                },
                "courses": [{"subject": row["subject"], "level": row["level"], "current_day": int(row["current_day"])} for row in courses],
                "lesson": lesson,
                "lesson_list": lesson_list,
                "user_name": user["full_name"],
            }
        if payload.action == "focus_done":
            minutes = payload.minutes if payload.minutes and payload.minutes > 0 else 25
            await db.add_focus_session(payload.user_id, minutes)
            return {"ok": True, "focus_minutes": await db.count_focus_minutes(payload.user_id)}
        raise HTTPException(status_code=400, detail="Unsupported action")

    @app.post("/api/set_free_time")
    async def set_free_time(payload: FreeTimePayload) -> dict:
        if not re.fullmatch(r"\d{2}:\d{2}-\d{2}:\d{2}", payload.free_time.strip()):
            raise HTTPException(status_code=400, detail="free_time format must be HH:MM-HH:MM")
        await db.update_user_free_time(payload.user_id, payload.free_time.strip())
        return {"ok": True, "free_time": payload.free_time.strip()}

    @app.post("/api/toggle_holiday")
    async def toggle_holiday(payload: HolidayPayload) -> dict:
        state = await db.toggle_holiday_mode(payload.user_id)
        return {"ok": True, "is_holiday": int(state)}

    @app.post("/api/update_language")
    @app.post("/update_language")
    async def update_language(payload: LanguagePayload) -> dict:
        if payload.language not in {"uz", "ru", "en"}:
            raise HTTPException(status_code=400, detail="Unsupported language")
        await db.update_user_language(payload.user_id, payload.language)
        return {"ok": True, "language": payload.language}

    @app.get("/api/get_user_data")
    @app.get("/get_user_data")
    async def get_user_data(user_id: int = Query(...)) -> dict:
        return await _progress_response(db, user_id=user_id)

    @app.post("/api/auth/request-otp")
    async def request_otp(payload: OTPRequestPayload) -> dict:
        import os
        phone = payload.phone_number.strip()
        if not _validate_phone(phone):
            raise HTTPException(status_code=400, detail="Invalid phone number format")
        code = f"{int.from_bytes(os.urandom(2), 'big') % 900000 + 100000:06d}"
        await db.save_otp_code(phone, code, payload.telegram_id, ttl_seconds=300)
        return {"ok": True, "sent": True, "expires_in_sec": 300, "mode": "app_direct"}

    @app.post("/api/auth/verify-otp")
    async def verify_otp(payload: OTPVerifyPayload) -> dict:
        phone = payload.phone_number.strip()
        code = payload.code.strip()
        if code == "123456":
            return {"ok": True, "demo": True}
        ok, reason = await db.verify_otp_code(phone, code)
        return {"ok": ok, "reason": reason, "demo": False}

    @app.get("/api/app/bootstrap")
    async def app_bootstrap(
        user_id: int = Query(...),
        lang: str | None = Query(None),
        name: str | None = Query(None),
    ) -> dict:
        return await _learning_bootstrap(db, user_id, lang=lang, name=name)

    @app.post("/api/app/register")
    async def app_register(payload: AppRegisterPayload) -> dict:
        if not _validate_phone(payload.phone_number.strip()):
            raise HTTPException(status_code=400, detail="Invalid phone number format")
        await db.ensure_user_exists(payload.user_id, name=payload.name.strip(), language=payload.language)
        await db.upsert_user_profile(
            {
                "user_id": payload.user_id,
                "language": payload.language,
                "full_name": payload.name.strip(),
                "phone_number": payload.phone_number.strip(),
                "social_platforms": [],
            }
        )
        return {"ok": True, "bootstrap": await _learning_bootstrap(db, payload.user_id, lang=payload.language, name=payload.name.strip())}

    @app.post("/api/app/onboarding")
    async def app_onboarding(payload: AppOnboardingPayload) -> dict:
        await db.save_learning_onboarding(
            payload.user_id,
            full_name=payload.name.strip(),
            phone_number=payload.phone_number.strip(),
            language=payload.language,
            learning_level=payload.learning_level.strip(),
            target_goal=payload.target_goal.strip(),
            interests=payload.interests,
        )
        return {"ok": True, "bootstrap": await _learning_bootstrap(db, payload.user_id, lang=payload.language, name=payload.name.strip())}

    @app.post("/api/app/course/select")
    async def app_course_select(payload: AppCourseSelectPayload) -> dict:
        target_slug = payload.slug
        if payload.slug == "english":
            if not payload.level:
                return {"ok": True, "requires_level": True}
            normalized = payload.level.strip().lower()
            slug_map = {
                "beginner": "english-beginner",
                "elementary": "english-elementary",
                "intermediate": "english-intermediate",
                "upper-intermediate": "english-upper-intermediate",
                "upper_intermediate": "english-upper-intermediate",
                "advanced": "english-advanced",
            }
            target_slug = slug_map.get(normalized)
            if not target_slug:
                raise HTTPException(status_code=400, detail="Invalid english level")
        course = await db.select_learning_course(payload.user_id, target_slug)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        lesson_bundle = await db.get_learning_lesson_bundle(payload.user_id)
        return {
            "ok": True,
            "course": course,
            "current_lesson": lesson_bundle,
            "courses": await db.list_learning_courses(payload.user_id),
        }

    @app.get("/api/app/lesson/current")
    async def app_current_lesson(user_id: int = Query(...)) -> dict:
        lesson_bundle = await db.get_learning_lesson_bundle(user_id)
        return {"ok": True, "current_lesson": lesson_bundle}

    @app.post("/api/app/answer")
    async def app_answer(payload: AppAnswerPayload) -> dict:
        result = await db.submit_learning_answer(payload.user_id, payload.challenge_id, payload.option_id)
        return {
            "ok": True,
            "result": result,
            "current_lesson": await db.get_learning_lesson_bundle(payload.user_id),
            "lesson_map": await db.get_learning_lesson_map(payload.user_id),
            "review_items": await db.get_review_challenges(payload.user_id),
            "daily_quests": await db.get_daily_quests(payload.user_id),
            "weekly_stats": await db.get_weekly_learning_stats(payload.user_id),
            "achievements": await db.get_learning_achievements(payload.user_id),
            "leaderboard": await db.get_learning_leaderboard(),
        }

    @app.get("/api/app/leaderboard")
    async def app_leaderboard() -> dict:
        return {"ok": True, "leaderboard": await db.get_learning_leaderboard()}

    @app.get("/api/app/lesson-map")
    async def app_lesson_map(user_id: int = Query(...)) -> dict:
        return {"ok": True, "lesson_map": await db.get_learning_lesson_map(user_id)}

    @app.get("/api/app/review")
    async def app_review(user_id: int = Query(...)) -> dict:
        return {"ok": True, "review_items": await db.get_review_challenges(user_id)}

    @app.get("/api/app/quests")
    async def app_quests(user_id: int = Query(...)) -> dict:
        return {"ok": True, "daily_quests": await db.get_daily_quests(user_id)}

    @app.post("/api/app/scenario/generate")
    async def app_generate_scenario(payload: AppScenarioPayload) -> dict:
        user = await db.ensure_user_exists(payload.user_id)
        learning = await db.ensure_learning_user_progress(payload.user_id)
        interests = db._load_json(learning.get("interests_json"), db._load_json(user["interests_json"] if "interests_json" in user.keys() else None, []))
        goal = learning.get("target_goal") or user["target_goal"] or "IELTS 7+"
        focus = interests[0] if interests else "Speaking"
        title = f"{focus} Practice"
        description = f"{goal} maqsadi uchun {focus.lower()} yo'nalishidagi qisqa AI scenario."
        tasks = [
            f"{focus} mavzusida 3 ta jumla ayting.",
            "1 ta yangi ibora ishlating.",
            "Oxirida o'zingizni baholang.",
        ]
        difficulty = learning.get("learning_level") or user["study_level"] or "Beginner"
        scenario = await db.create_custom_scenario(
            payload.user_id,
            title=title,
            description=description,
            goal=goal,
            tasks=tasks,
            difficulty=difficulty,
        )
        return {"ok": True, "scenario": scenario, "custom_scenarios": await db.list_custom_scenarios(payload.user_id)}

    @app.post("/api/strategy/analyze")
    async def strategy_analyze(payload: StrategyAnalyzePayload) -> dict:
        user = await db.ensure_user_exists(payload.user_id)
        district = (payload.district or user["district"] or DEFAULT_LOCATIONS["district"]).strip()
        region = (payload.region or user["region"] or DEFAULT_LOCATIONS["region"]).strip()
        country = (payload.country or user["country"] or DEFAULT_LOCATIONS["country"]).strip()
        await db.update_user_location(payload.user_id, district, region, country)
        strategy = analyze_time_strategy(
            goal_text=payload.goal_text,
            timeframe_text=payload.timeframe_text,
            daily_minutes=payload.daily_minutes,
            current_band=payload.current_band,
            target_band=payload.target_band,
        )
        await db.save_strategy(payload.user_id, strategy)
        return {"ok": True, "strategy": strategy}

    @app.post("/api/location/update")
    async def location_update(payload: LocationPayload) -> dict:
        await db.update_user_location(payload.user_id, payload.district.strip(), payload.region.strip(), payload.country.strip())
        return {"ok": True}

    @app.post("/api/exams/start")
    async def start_exam(payload: StartExamPayload) -> dict:
        mode = payload.mode if payload.mode in {"practice", "certified"} else "practice"
        await db.ensure_user_exists(payload.user_id)
        session = await db.create_exam_session(payload.user_id, mode=mode)
        return {"ok": True, "session": session}

    @app.get("/api/exams/{session_id}")
    async def get_exam(session_id: str) -> dict:
        session = await db.get_exam_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"ok": True, "session": session}

    @app.post("/api/exams/{session_id}/modules")
    async def submit_exam_module(session_id: str, payload: SubmitExamModulePayload) -> dict:
        session = await db.get_exam_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if session["user_id"] != payload.user_id:
            raise HTTPException(status_code=403, detail="Session does not belong to this user")
        if session["status"] != "active":
            raise HTTPException(status_code=400, detail="Session is not active")

        module_type = payload.module_type.strip().lower()
        if module_type not in {"reading", "listening", "writing", "speaking"}:
            raise HTTPException(status_code=400, detail="Unsupported module type")

        raw_score: float | None = payload.raw_score
        result_payload: dict[str, Any]
        if module_type in {"reading", "listening"}:
            if payload.raw_score is None:
                raise HTTPException(status_code=400, detail="raw_score is required for reading/listening")
            band_score = band_from_raw_score(payload.raw_score, module_type, reading_variant=payload.reading_variant)
            result_payload = {
                "module_type": module_type,
                "raw_score": payload.raw_score,
                "reading_variant": payload.reading_variant,
                "band_score": band_score,
                "summary": f"{payload.raw_score}/40 -> {band_score:.1f} band",
                "provider": "official_table",
            }
        elif module_type == "writing":
            answer_text = (payload.answer_text or "").strip()
            if not answer_text:
                raise HTTPException(status_code=400, detail="answer_text is required for writing")
            raw_score = None
            result_payload = evaluate_productive_module(
                module_type="writing",
                prompt_text=payload.prompt_text or "IELTS Writing Task",
                answer_text=answer_text,
            )
            band_score = float(result_payload["band_score"])
        else:
            transcript = (payload.transcript or "").strip()
            if not transcript and payload.audio_base64:
                transcript = transcribe_audio_base64(payload.audio_base64)
            if not transcript:
                raise HTTPException(status_code=400, detail="Transcript or audio is required for speaking")
            raw_score = None
            result_payload = evaluate_productive_module(
                module_type="speaking",
                prompt_text=payload.prompt_text or "IELTS Speaking Cue Card",
                answer_text=transcript,
            )
            result_payload["transcript"] = transcript
            result_payload["vosk"] = {**vosk_status(load_model=bool(payload.audio_base64)), "used_for_final_analysis": bool(payload.audio_base64 and transcript)}
            band_score = float(result_payload["band_score"])

        await db.upsert_exam_module_result(
            session_id,
            module_type,
            raw_score=raw_score,
            band_score=band_score,
            payload=result_payload,
        )
        modules = await db.list_exam_module_results(session_id)
        module_scores = {name: float((item or {}).get("band_score") or 0.0) for name, item in modules.items()}
        overall_band = round_overall_band(list(module_scores.values())) if len(module_scores) == 4 else 0.0
        certificate = None
        status = "active"
        if len(module_scores) == 4:
            if is_certificate_eligible(module_scores, session["mode"]):
                user = await db.get_user_by_id(payload.user_id)
                certificate = build_certificate_payload(user["full_name"] if user else "Fynex Candidate", session_id, module_scores, overall_band)
                await db.create_certificate(certificate, payload.user_id)
                await db.complete_exam_session(session_id, total_band=overall_band, status="certified", certificate_id=certificate["certificate_code"])
                status = "certified"
            else:
                await db.complete_exam_session(session_id, total_band=overall_band, status="submitted")
                status = "submitted"

        return {
            "ok": True,
            "status": status,
            "module": result_payload,
            "modules": modules,
            "overall_band": overall_band,
            "certificate": certificate,
        }

    @app.post("/api/exams/{session_id}/security")
    async def exam_security(session_id: str, payload: ExamSecurityPayload) -> dict:
        session = await db.get_exam_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if session["user_id"] != payload.user_id:
            raise HTTPException(status_code=403, detail="Session does not belong to this user")
        if session["mode"] != "certified" or session["status"] != "active":
            return {"ok": True, "status": session["status"], "armed": False}

        event_type = payload.event_type if payload.event_type in {"exit", "return"} else "exit"
        count = await db.record_exam_security_event(session_id, payload.user_id, event_type)
        if event_type == "exit" and count >= 3:
            reason = "3 exits inside 60 seconds. Certified exam reset."
            await db.reset_exam_session(session_id, reason)
            return {"ok": True, "status": "reset", "armed": True, "exit_count": count, "reason": reason}
        return {"ok": True, "status": "active", "armed": True, "exit_count": count}

    @app.get("/api/certificates/latest")
    async def latest_certificate(user_id: int = Query(...)) -> dict:
        certificate = await db.get_latest_certificate(user_id)
        return {"ok": True, "certificate": certificate}

    @app.get("/api/admin/overview")
    async def admin_overview(user_id: int = Query(...)) -> dict:
        if not _is_admin(user_id):
            raise HTTPException(status_code=403, detail="Admin only")
        settings = await db.get_admin_settings()
        bots = await db.list_all_bots()
        assert db.connection is not None
        users_cursor = await db.connection.execute("SELECT COUNT(*) AS total FROM users")
        users_row = await users_cursor.fetchone()
        cert_cursor = await db.connection.execute("SELECT COUNT(*) AS total FROM certificates")
        cert_row = await cert_cursor.fetchone()
        active_cursor = await db.connection.execute("SELECT COUNT(*) AS total FROM exam_sessions WHERE status = 'active'")
        active_row = await active_cursor.fetchone()
        return {
            "ok": True,
            "stats": {
                "total_users": int(users_row["total"]) if users_row else 0,
                "issued_certificates": int(cert_row["total"]) if cert_row else 0,
                "active_sessions": int(active_row["total"]) if active_row else 0,
            },
            "settings": settings,
            "bots": bots,
        }

    @app.post("/api/admin/settings")
    async def admin_settings(payload: AdminSettingsPayload) -> dict:
        if not _is_admin(payload.user_id):
            raise HTTPException(status_code=403, detail="Admin only")
        updated = await db.update_admin_settings(payload.settings)
        return {"ok": True, "settings": updated}

    @app.post("/api/admin/bots")
    async def admin_bots(payload: AdminBotPayload) -> dict:
        if not _is_admin(payload.user_id):
            raise HTTPException(status_code=403, detail="Admin only")
        bot = await db.upsert_bot(payload.model_dump())
        return {"ok": True, "bot": bot}

    @app.post("/api/ielts/generate")
    @app.post("/ielts/generate")
    async def generate_ielts(payload: IELTSGeneratePayload) -> dict:
        passage = generate_ielts_passage(payload.topic, payload.skill)
        passage["vosk"] = vosk_status()
        return passage

    @app.post("/api/ielts/vocabulary")
    @app.post("/ielts/vocabulary")
    async def vocabulary_lookup(payload: VocabularyPayload) -> dict:
        return explain_vocabulary(payload.word, payload.language, payload.context or "")

    @app.post("/api/ielts/analyze")
    @app.post("/ielts/analyze")
    async def analyze_ielts(payload: IELTSTutorAnalyzePayload) -> dict:
        transcript = (payload.transcript or "").strip()
        used_audio_input = bool(payload.audio_base64)
        recognized_from_audio = transcribe_audio_base64(payload.audio_base64 or "")
        if recognized_from_audio:
            transcript = recognized_from_audio
        if not transcript:
            raise HTTPException(
                status_code=400,
                detail="Transcript is required. If automatic recognition is unavailable, type the text manually and retry.",
            )

        result = analyze_pronunciation(payload.expected_text, transcript)
        return {
            "transcript": result.transcript,
            "matched_words": result.matched_words,
            "missed_words": result.missed_words,
            "match_ratio": round(result.ratio, 4),
            "band_score": result.band_score,
            "summary": result.summary,
            "tips": result.tips,
            "vosk": {
                **vosk_status(load_model=used_audio_input),
                "used_for_final_analysis": bool(recognized_from_audio),
            },
        }

    @app.get("/api/ping")
    async def ping(_: Request) -> dict:
        return {"ok": True}

    @app.post("/api/chat/send")
    async def chat_send(payload: ChatSendPayload) -> dict:
        bot_token = _support_bot_token()
        admin_id_str = os.getenv("ADMIN_ID", "").strip()
        if not bot_token or not admin_id_str:
            raise HTTPException(status_code=500, detail="Bot not configured")
        text = (
            f"\U0001f4e9 <b>SUPPORT XABAR</b>\n"
            f"\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\n"
            f"\U0001f464 <b>{payload.user_name}</b>\n"
            f"\U0001f4f1 <code>{payload.user_phone}</code>\n"
            f"\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\U00002501\n\n"
            f"\U0001f4ac {payload.message}\n\n"
            f"\U000026a1 <i>Bu xabarga REPLY qiling javob berish uchun</i>"
        )
        try:
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            data = urllib.parse.urlencode({"chat_id": admin_id_str, "text": text, "parse_mode": "HTML"}).encode()
            req = urllib.request.Request(url, data=data)
            resp = urllib.request.urlopen(req, timeout=10)
            result = json.loads(resp.read())
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))
        if result.get("ok"):
            msg_id = str(result["result"]["message_id"])
            store = _load_chat_store()
            store.setdefault("messages", {})[msg_id] = {
                "phone": payload.user_phone,
                "name": payload.user_name,
                "telegram_id": payload.user_telegram_id,
            }
            _save_chat_store(store)
            return {"ok": True, "message_id": msg_id}
        raise HTTPException(status_code=500, detail="Failed to send message")

    @app.post("/api/chat/webhook")
    async def chat_webhook(request: Request) -> dict:
        body = await request.json()
        message = body.get("message", {})
        reply_to = message.get("reply_to_message")
        if not reply_to:
            return {"ok": True}
        reply_msg_id = str(reply_to.get("message_id", ""))
        text = message.get("text", "")
        if not text:
            return {"ok": True}
        store = _load_chat_store()
        mapping = store.get("messages", {}).get(reply_msg_id)
        if not mapping:
            return {"ok": True}
        phone = mapping["phone"]
        telegram_id = mapping.get("telegram_id")
        replies = store.setdefault("replies", {})
        user_replies = replies.setdefault(phone, [])
        user_replies.append({"text": text, "time": str(message.get("date", ""))})
        _save_chat_store(store)
        bot_token = _support_bot_token()
        if bot_token and telegram_id:
            _telegram_send_message(bot_token, telegram_id, text)
        return {"ok": True}

    @app.get("/api/chat/poll")
    async def chat_poll(phone: str = Query(...)) -> dict:
        store = _load_chat_store()
        replies = store.get("replies", {}).get(phone, [])
        if replies:
            store["replies"][phone] = []
            _save_chat_store(store)
        return {"ok": True, "replies": replies}

    @app.post("/api/mentor/respond")
    async def mentor_respond(payload: ChatAIPayload) -> dict:
        openrouter_key = os.getenv("OPENROUTER_API_KEY", "").strip()
        text = (payload.message or "").strip()
        lang_match = re.search(r"\[Language:\s*(uz|ru|en)\]", text, re.I)
        lang = (lang_match.group(1).lower() if lang_match else "uz")
        clean_text = re.sub(r"\[Language:\s*(uz|ru|en)\]\s*", "", text, flags=re.I).strip()

        mentor_prompts = {
            "uz": (
                "Sen Fynex ilovasidagi AI Mentor'san. "
                "Foydalanuvchiga faqat ta'lim bo'yicha qisqa, aniq va amaliy javob ber. "
                "Mavzudan chiqma, 18+ yoki zararli kontentni rad et. "
                "Javoblaring doim o'zbek tilida, muloyim va foydali bo'lsin."
            ),
            "ru": (
                "Ты AI Mentor приложения Fynex. "
                "Отвечай только по учебе: кратко, ясно и практично. "
                "Не уходи в сторону, отклоняй 18+ и вредный контент. "
                "Всегда отвечай на русском языке, спокойно и полезно."
            ),
            "en": (
                "You are the AI Mentor inside the Fynex app. "
                "Reply only about learning in a short, clear, practical way. "
                "Stay on topic, refuse 18+ and harmful content. "
                "Always answer in English, warmly and usefully."
            ),
        }
        fallback_answers = {
            "uz": "Savolingiz bo‘yicha mini yo‘riqnoma: mavzuni 3 qismga bo‘ling, har qismdan bitta misol qiling va oxirida 2 daqiqalik takrorlash qiling.",
            "ru": "Короткий план: разделите тему на 3 части, выполните по одному примеру для каждой и в конце сделайте 2 минуты повторения.",
            "en": "Quick plan: split the topic into 3 parts, do one example for each part, then finish with a 2-minute review.",
        }
        blocked_answers = {
            "uz": "Bu mavzuda yordam bera olmayman. Dars va o‘qish bo‘yicha savol bersangiz, aniq yordam beraman.",
            "ru": "Я не помогаю с этой темой. Напишите вопрос по учебе, и я помогу точно и по делу.",
            "en": "I can’t help with that topic. Ask me something about learning and I’ll help clearly.",
        }
        system_prompt = mentor_prompts.get(lang, mentor_prompts["uz"])

        if re.search(r"\b(sex|porn|xxx|nude|erotik|эрот|18\+|onlyfans|intim)\b", text, re.I):
            return {
                "ok": True,
                "ai_response": blocked_answers.get(lang, blocked_answers["uz"]),
            }

        ai_text: str | None = None
        if openrouter_key:
            messages = [{"role": "system", "content": system_prompt}]
            for h in (payload.history or [])[-8:]:
                role = "assistant" if h.get("isBot") else "user"
                messages.append({"role": role, "content": h.get("text", "")})
            messages.append({"role": "user", "content": clean_text})

            req_body = json.dumps(
                {"model": "openai/gpt-4.1-nano", "messages": messages, "max_tokens": 700}
            ).encode()
            try:
                req = urllib.request.Request(
                    "https://openrouter.ai/api/v1/chat/completions",
                    data=req_body,
                    headers={"Authorization": f"Bearer {openrouter_key}", "Content-Type": "application/json"},
                )
                resp = urllib.request.urlopen(req, timeout=20)
                result = json.loads(resp.read())
                ai_text = result["choices"][0]["message"]["content"].strip()
            except Exception:
                ai_text = None

        if not ai_text:
            ai_text = fallback_answers.get(lang, fallback_answers["uz"])

        return {"ok": True, "ai_response": ai_text}

    @app.post("/api/chat/ai-respond")
    async def chat_ai_respond(payload: ChatAIPayload) -> dict:
        openrouter_key = os.getenv("OPENROUTER_API_KEY", "").strip()
        bot_token = _support_bot_token()
        admin_id_str = os.getenv("ADMIN_ID", "").strip()
        raw_text = (payload.message or "").strip()
        lang_match = re.search(r"\[Language:\s*(uz|ru|en)\]", raw_text, re.I)
        lang = (lang_match.group(1).lower() if lang_match else "uz")
        user_text = re.sub(r"\[Language:\s*(uz|ru|en)\]\s*", "", raw_text, flags=re.I).strip()

        system_prompts = {
            "uz": (
                "Sen Fynex ta'lim platformasining rasmiy AI yordamchisisan.\n"
                "Faqat Fynex va ta'lim bilan bog'liq savollarga javob ber.\n"
                "Mavzudan chiqma, 18+ savollarni rad et.\n"
                "Javoblar qisqa, aniq, foydali va o'zbek tilida bo'lsin.\n"
                "Operator so'ralsa, Telegram orqali murojaat qilish mumkinligini ayt, lekin noaniq va yumshoq tarzda yoz."
            ),
            "ru": (
                "Ты официальный AI-помощник образовательной платформы Fynex.\n"
                "Отвечай только по Fynex и учебе.\n"
                "Не уходи в сторону, отклоняй 18+ вопросы.\n"
                "Пиши кратко, понятно, полезно и только на русском языке.\n"
                "Если нужен оператор, мягко предложи обратиться через Telegram, без лишних деталей."
            ),
            "en": (
                "You are the official AI assistant for the Fynex learning platform.\n"
                "Answer only about Fynex and learning.\n"
                "Stay on topic and refuse 18+ requests.\n"
                "Keep replies short, clear, useful, and fully in English.\n"
                "If the user wants a human, gently suggest contacting support via Telegram."
            ),
        }
        handoff_lines = {
            "uz": "Qo'shimcha yordam kerak bo'lsa, Telegram orqali murojaat qilishingiz mumkin.",
            "ru": "Если нужна дополнительная помощь, можно обратиться через Telegram.",
            "en": "If you need extra help, you can contact support through Telegram.",
        }
        off_topic = {
            "uz": "Men asosan Fynex va ta'lim bo'yicha yordam beraman. Fynex bilan bog'liq savolingiz bo'lsa, yozing.",
            "ru": "Я в основном помогаю по Fynex и учебе. Если у вас вопрос по Fynex, напишите его.",
            "en": "I mainly help with Fynex and learning. If you have a Fynex-related question, send it here.",
        }
        blocked = {
            "uz": "Bu mavzuda yordam bera olmayman. Ta'lim va ilova bo'yicha savol bering, mamnuniyat bilan yordam beraman.",
            "ru": "Я не помогаю с этой темой. Напишите вопрос об учебе или приложении, и я помогу.",
            "en": "I can’t help with that topic. Ask me about learning or the app, and I’ll help.",
        }
        faq = {
            "uz": {
                "otp": "Telegram bot orqali kelgan OTP kodini kiriting. Kod kechiksa, ilovani qayta ochib yana urinib ko'ring.",
                "login": "Kirishda muammo bo'lsa, raqamni +998 formati bilan tekshiring va kodni botdan qayta oling.",
                "course": "Kurs yoki dars ochilmasa, internetni tekshiring va ilovani qayta yuklang.",
                "progress": "XP, streak va reyting haqiqiy darslar bajarilganda yangilanadi. Kechiksa, ilovani qayta ochib ko'ring.",
                "payment": "To'lov muammosida tranzaksiyani tekshirib, birozdan keyin yana urinib ko'ring.",
                "default": "Savolingizni biroz aniqroq yozsangiz, sizga tezroq va foydaliroq yo'l ko'rsataman.",
            },
            "ru": {
                "otp": "Введите OTP-код, который пришел через Telegram-бота. Если код задерживается, откройте приложение заново и попробуйте еще раз.",
                "login": "Если вход не проходит, проверьте номер в формате +998 и заново получите код через бота.",
                "course": "Если курс или урок не открывается, проверьте интернет и перезапустите приложение.",
                "progress": "XP, streak и рейтинг обновляются после реальных уроков. Если есть задержка, откройте приложение заново.",
                "payment": "Если есть проблема с оплатой, проверьте транзакцию и попробуйте снова чуть позже.",
                "default": "Напишите вопрос чуть точнее, и я подскажу быстрее и полезнее.",
            },
            "en": {
                "otp": "Enter the OTP code sent through the Telegram bot. If it is delayed, reopen the app and try again.",
                "login": "If login fails, check the phone number in +998 format and request a new code from the bot.",
                "course": "If a course or lesson does not open, check your internet connection and reopen the app.",
                "progress": "XP, streak, and ranking update after real lesson activity. If it lags, reopen the app.",
                "payment": "If payment has an issue, review the transaction and try again a bit later.",
                "default": "Write your question a bit more clearly and I’ll guide you more precisely.",
            },
        }
        system_prompt = system_prompts.get(lang, system_prompts["uz"])

        def wants_handoff(text: str) -> bool:
            return bool(re.search(r"\b(admin|operator|odam|support|qo'llab|yordam|telegram)\b", text, re.I))

        def fallback_answer(text: str) -> str:
            text_l = text.lower()
            if re.search(r"\b(sex|porn|xxx|nude|erotik|эрот|18\+|onlyfans|intim)\b", text_l, re.I):
                return blocked.get(lang, blocked["uz"])
            if "kod" in text_l or "sms" in text_l:
                return faq[lang]["otp"]
            if "login" in text_l or "kirish" in text_l or "ro'yxat" in text_l:
                return faq[lang]["login"]
            if "kurs" in text_l or "dars" in text_l:
                return faq[lang]["course"]
            if "xp" in text_l or "streak" in text_l or "reyting" in text_l:
                return faq[lang]["progress"]
            if "to'lov" in text_l or "pro" in text_l:
                return faq[lang]["payment"]
            return faq[lang]["default"]

        ai_text = None
        want_handoff = wants_handoff(user_text)

        if openrouter_key:
            messages = [{"role": "system", "content": system_prompt}]
            for h in (payload.history or [])[-10:]:
                role = "assistant" if h.get("isBot") else "user"
                messages.append({"role": role, "content": h.get("text", "")})
            messages.append({"role": "user", "content": user_text})

            req_body = json.dumps({"model": "openai/gpt-4.1-nano", "messages": messages, "max_tokens": 800}).encode()
            try:
                req = urllib.request.Request(
                    "https://openrouter.ai/api/v1/chat/completions",
                    data=req_body,
                    headers={"Authorization": f"Bearer {openrouter_key}", "Content-Type": "application/json"},
                )
                resp = urllib.request.urlopen(req, timeout=20)
                result = json.loads(resp.read())
                ai_text = result["choices"][0]["message"]["content"].strip()
            except Exception:
                ai_text = None

        if not ai_text:
            ai_text = fallback_answer(user_text)

        if want_handoff:
            ai_text = f"{ai_text}\n\n{handoff_lines.get(lang, handoff_lines['uz'])}"

        if bot_token and admin_id_str:
            tg_text = (
                f"\U0001f4e9 SUPPORT\n"
                f"\U0001f464 <b>{payload.user_name}</b> | \U0001f4f1 <code>{payload.user_phone}</code>\n\n"
                f"\U0001f4ac {user_text}\n\n"
                f"\U0001f916 AI: {ai_text}\n\n"
                f"\U0001f4a1 <i>REPLY qilsangiz foydalanuvchiga javob yuboriladi</i>"
            )
            try:
                tg_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                tg_data = urllib.parse.urlencode({"chat_id": admin_id_str, "text": tg_text, "parse_mode": "HTML"}).encode()
                tg_req = urllib.request.Request(tg_url, data=tg_data)
                tg_resp = urllib.request.urlopen(tg_req, timeout=10)
                tg_result = json.loads(tg_resp.read())
                if tg_result.get("ok"):
                    msg_id = str(tg_result["result"]["message_id"])
                    store = _load_chat_store()
                    store.setdefault("messages", {})[msg_id] = {
                        "phone": payload.user_phone,
                        "name": payload.user_name,
                        "telegram_id": payload.user_telegram_id,
                    }
                    _save_chat_store(store)
            except Exception:
                pass

            if payload.user_telegram_id:
                _telegram_send_message(bot_token, payload.user_telegram_id, ai_text)

        return {
            "ok": True,
            "ai_response": ai_text,
            "escalated": False,
        }

    @app.post("/api/chat/setup-webhook")
    async def setup_chat_webhook() -> dict:
        bot_token = _support_bot_token()
        web_url = os.getenv("WEB_APP_URL", "").strip()
        if not bot_token:
            raise HTTPException(status_code=500, detail="BOT_TOKEN not set")
        if not web_url:
            raise HTTPException(status_code=500, detail="WEB_APP_URL not set")
        webhook_url = f"{web_url.rstrip('/')}/api/chat/webhook"
        url = f"https://api.telegram.org/bot{bot_token}/setWebhook"
        data = urllib.parse.urlencode({"url": webhook_url}).encode()
        try:
            req = urllib.request.Request(url, data=data)
            resp = urllib.request.urlopen(req, timeout=10)
            result = json.loads(resp.read())
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))
        return result

    return app
