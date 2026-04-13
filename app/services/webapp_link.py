from __future__ import annotations

import json
from urllib.parse import urlencode

from app.database.sqlite import Database


async def build_webapp_url(base_url: str, view: str, db: Database, user_id: int) -> str:
    user = await db.get_user_by_id(user_id)
    if user is None:
        return f"{base_url.rstrip('/')}/?view={view}"

    streak = await db.get_streak_count(user_id)
    completed_lessons = await db.count_completed_lessons(user_id)
    focus_minutes = await db.count_focus_minutes(user_id)
    primary_course = await db.get_primary_course(user_id)
    user_courses = await db.list_user_courses(user_id)

    params = {
        "view": view,
        "user_id": user_id,
        "lang": user["language"] or "uz",
        "name": user["full_name"],
        "phone": user["phone_number"] or "",
        "goal": user["user_goal"] or "",
        "social_time": user["daily_social_time"] or "",
        "free_time": user["user_free_time"] or "",
        "holiday": int(user["is_holiday"] or 0),
        "streak": streak,
        "lessons": completed_lessons,
        "focus_minutes": focus_minutes,
        "courses_json": json.dumps(
            [
                {
                    "subject": course["subject"],
                    "level": course["level"],
                    "day": course["current_day"],
                }
                for course in user_courses
            ],
            ensure_ascii=False,
        ),
    }

    if primary_course:
        params.update(
            {
                "subject": primary_course["subject"],
                "level": primary_course["level"],
                "day": primary_course["current_day"],
            }
        )

    return f"{base_url.rstrip('/')}/?{urlencode(params)}"
