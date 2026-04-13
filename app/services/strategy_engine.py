from __future__ import annotations

import math
import re
from dataclasses import asdict, dataclass
from datetime import date, datetime, timedelta

from app.services.openrouter_client import openrouter_json_completion


MONTH_ALIASES = {
    1: {"jan", "january", "yanvar", "yan", "january", "январь"},
    2: {"feb", "february", "fevral", "fev", "февраль"},
    3: {"mar", "march", "mart", "марта", "март"},
    4: {"apr", "april", "aprel", "апрель", "апреля"},
    5: {"may", "май"},
    6: {"jun", "june", "iyun", "июнь", "июня"},
    7: {"jul", "july", "iyul", "июль", "июля"},
    8: {"aug", "august", "avgust", "август", "августа"},
    9: {"sep", "sept", "september", "sentyabr", "sentyabr", "сентябрь", "сентября"},
    10: {"oct", "october", "oktyabr", "октябрь", "октября"},
    11: {"nov", "november", "noyabr", "ноябрь", "ноября"},
    12: {"dec", "december", "dekabr", "декабрь", "декабря"},
}


@dataclass(slots=True)
class ParsedTimeframe:
    original_text: str
    normalized_text: str
    days_available: int
    deadline_iso: str | None
    detected_mode: str


def _normalize_time_text(text: str) -> str:
    return " ".join((text or "").strip().lower().replace("'", "").replace("`", "").split())


def _month_number(token: str) -> int | None:
    normalized = token.strip().lower().replace(".", "")
    for month_number, aliases in MONTH_ALIASES.items():
        if normalized in aliases:
            return month_number
    return None


def parse_target_band(goal_text: str, fallback: float = 7.0) -> float:
    match = re.search(r"([4-9](?:\.[05])?)", goal_text or "")
    if not match:
        return fallback
    try:
        return max(4.0, min(9.0, float(match.group(1))))
    except ValueError:
        return fallback


def parse_timeframe(text: str, today: date | None = None) -> ParsedTimeframe:
    now = today or date.today()
    original = (text or "").strip()
    normalized = _normalize_time_text(original)

    if not normalized:
        target = now + timedelta(days=90)
        return ParsedTimeframe(original, "90 days", 90, target.isoformat(), "fallback")

    absolute_match = re.fullmatch(r"(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})", normalized)
    if absolute_match:
        year, month, day = map(int, absolute_match.groups())
        target = date(year, month, day)
        return ParsedTimeframe(original, normalized, max(1, (target - now).days), target.isoformat(), "absolute")

    local_match = re.search(r"(\d{1,2})\s*[-/.]?\s*([a-zа-я]+)(?:\s*(\d{4}))?", normalized, re.I)
    if local_match:
        day = int(local_match.group(1))
        month_token = local_match.group(2)
        month = _month_number(month_token)
        if month:
            year = int(local_match.group(3)) if local_match.group(3) else now.year
            target = date(year, month, day)
            if target < now:
                target = date(year + 1, month, day)
            return ParsedTimeframe(
                original,
                normalized,
                max(1, (target - now).days),
                target.isoformat(),
                "named_date",
            )

    relative_match = re.search(r"(\d+)\s*(kun|day|days|hafta|week|weeks|oy|month|months)", normalized)
    if relative_match:
        count = max(1, int(relative_match.group(1)))
        unit = relative_match.group(2)
        if unit in {"kun", "day", "days"}:
            days = count
        elif unit in {"hafta", "week", "weeks"}:
            days = count * 7
        else:
            days = count * 30
        target = now + timedelta(days=days)
        return ParsedTimeframe(original, normalized, days, target.isoformat(), "relative")

    numeric_match = re.search(r"(\d+)", normalized)
    if numeric_match:
        days = max(1, int(numeric_match.group(1)))
        target = now + timedelta(days=days)
        return ParsedTimeframe(original, normalized, days, target.isoformat(), "numeric_guess")

    target = now + timedelta(days=90)
    return ParsedTimeframe(original, normalized, 90, target.isoformat(), "fallback")


def _intensity_label(days_available: int) -> str:
    if days_available <= 7:
        return "emergency"
    if days_available <= 21:
        return "intensive"
    if days_available <= 90:
        return "balanced"
    return "fundamental"


def _estimate_band_gain(days_available: int, daily_minutes: int) -> float:
    return round(min(2.0, (days_available / 90) * 0.9 + (daily_minutes / 180) * 0.8), 2)


def _success_rate(days_available: int, daily_minutes: int, current_band: float, target_band: float) -> int:
    band_gap = max(0.0, target_band - current_band)
    pace_score = min(38.0, days_available * 0.42)
    time_score = min(24.0, daily_minutes * 0.12)
    gap_penalty = band_gap * 12.5
    pressure_penalty = 18.0 if days_available <= 7 else 9.0 if days_available <= 21 else 0.0
    score = 34.0 + pace_score + time_score - gap_penalty - pressure_penalty
    return max(6, min(96, int(round(score))))


def _fallback_plan(
    *,
    goal_text: str,
    timeframe: ParsedTimeframe,
    daily_minutes: int,
    current_band: float,
    target_band: float,
) -> dict:
    intensity = _intensity_label(timeframe.days_available)
    success_rate = _success_rate(timeframe.days_available, daily_minutes, current_band, target_band)
    estimated_band = round(min(9.0, current_band + _estimate_band_gain(timeframe.days_available, daily_minutes)), 1)

    if intensity == "emergency":
        summary = "Vaqt juda qisqa. Hozir mukammallik emas, tirik qoladigan reja kerak."
        focus = [
            "Har kuni 2 ta full focus blok qiling.",
            "Faqat yuqori bal beradigan IELTS patternlarni qayta ishlang.",
            "Har kecha bitta mini mock bilan xatoni yopib boring.",
        ]
    elif intensity == "intensive":
        summary = "Vaqt qisqa, lekin hal qilsa bo'ladi. Har kunning sifati hal qiladi."
        focus = [
            "Kuniga Reading + Writing yoki Listening + Speaking juftlikda ishlang.",
            "Har 3 kunda bitta timed practice qiling.",
            "Weak zone ni birinchi haftadayoq topib, o'shani bosib boring.",
        ]
    elif intensity == "balanced":
        summary = "Reja real. Intizom saqlansa, o'sish ko'rinadi."
        focus = [
            "Haftani foundation va exam practice o'rtasida teng bo'ling.",
            "Har hafta bitta full skill review qiling.",
            "Writing va Speaking feedbackni sovuqqon qabul qiling.",
        ]
    else:
        summary = "Vaqt bor. Endi poydevorni chiroyli qo'yish kerak."
        focus = [
            "Avval til bazasi va vocabni sokin tempda ko'taring.",
            "Har hafta 2 ta deep-work blokni IELTS formatiga bag'ishlang.",
            "Shoshmasdan, lekin uzilmasdan boring.",
        ]

    return {
        "focus_mode": intensity,
        "success_rate": success_rate,
        "estimated_band": estimated_band,
        "summary": summary,
        "main_message": f"Hozirgi yo'l bilan {target_band:.1f} band sari yurish mumkin, lekin {daily_minutes} daqiqani himoya qilishingiz kerak.",
        "daily_plan": focus,
        "weekly_targets": [
            "2 ta timed Reading yoki Listening set",
            "2 ta Writing yoki Speaking feedback sikli",
            "1 ta xato daftari review",
        ],
        "red_flags": [
            "Bir kunlik tanaffusni bir haftalik sukutga aylantirmang.",
            "Faqat motivatsiya bilan emas, jadval bilan ishlang.",
            "Bandni emas, zaif joyni uring.",
        ],
    }


def analyze_time_strategy(
    *,
    goal_text: str,
    timeframe_text: str,
    daily_minutes: int,
    current_band: float = 5.0,
    target_band: float | None = None,
    today: date | None = None,
) -> dict:
    parsed = parse_timeframe(timeframe_text, today=today)
    safe_daily_minutes = max(20, min(600, int(daily_minutes or 90)))
    resolved_target_band = target_band if target_band is not None else parse_target_band(goal_text)
    fallback = _fallback_plan(
        goal_text=goal_text,
        timeframe=parsed,
        daily_minutes=safe_daily_minutes,
        current_band=current_band,
        target_band=resolved_target_band,
    )

    system_prompt = (
        "You are a strict IELTS and study strategist. "
        "Write in Uzbek Latin. "
        "Be calm, realistic, concise, and human. "
        "Do not overpromise. "
        "Return strict JSON with keys: focus_mode, success_rate, estimated_band, summary, "
        "main_message, daily_plan, weekly_targets, red_flags. "
        "focus_mode must be one of: emergency, intensive, balanced, fundamental. "
        "daily_plan, weekly_targets and red_flags must be arrays of 3 short strings."
    )
    user_prompt = (
        f"Today: {(today or date.today()).isoformat()}\n"
        f"Goal: {goal_text}\n"
        f"Timeframe text: {timeframe_text}\n"
        f"Detected days available: {parsed.days_available}\n"
        f"Daily study minutes: {safe_daily_minutes}\n"
        f"Current IELTS band: {current_band}\n"
        f"Target IELTS band: {resolved_target_band}\n"
        "The tone should feel like a sharp but caring mentor. "
        "If the time is too short, say so directly and switch to survival strategy."
    )
    ai_result = openrouter_json_completion(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=0.25,
        max_tokens=900,
    )
    if isinstance(ai_result, dict) and ai_result.get("summary"):
        result = fallback | ai_result
        try:
            ai_success_rate = int(float(ai_result.get("success_rate", fallback["success_rate"])))
        except (TypeError, ValueError):
            ai_success_rate = int(fallback["success_rate"])
        result["success_rate"] = max(5, min(97, ai_success_rate))
        try:
            result["estimated_band"] = round(float(ai_result.get("estimated_band", fallback["estimated_band"])), 1)
        except (TypeError, ValueError):
            result["estimated_band"] = fallback["estimated_band"]
    else:
        result = fallback

    result["timeframe"] = asdict(parsed)
    result["goal_text"] = goal_text
    result["current_band"] = round(float(current_band), 1)
    result["target_band"] = round(float(resolved_target_band), 1)
    result["daily_minutes"] = safe_daily_minutes
    result["updated_at"] = datetime.utcnow().isoformat(timespec="seconds")
    return result
