from __future__ import annotations

import math
import re
import uuid
from datetime import datetime

from app.services.openrouter_client import openrouter_json_completion


LISTENING_BANDS = [
    (39, 40, 9.0),
    (37, 38, 8.5),
    (35, 36, 8.0),
    (32, 34, 7.5),
    (30, 31, 7.0),
    (26, 29, 6.5),
    (23, 25, 6.0),
    (18, 22, 5.5),
    (16, 17, 5.0),
    (13, 15, 4.5),
    (10, 12, 4.0),
    (8, 9, 3.5),
    (6, 7, 3.0),
    (4, 5, 2.5),
    (2, 3, 2.0),
    (1, 1, 1.0),
]

ACADEMIC_READING_BANDS = [
    (39, 40, 9.0),
    (37, 38, 8.5),
    (35, 36, 8.0),
    (33, 34, 7.5),
    (30, 32, 7.0),
    (27, 29, 6.5),
    (23, 26, 6.0),
    (19, 22, 5.5),
    (15, 18, 5.0),
    (13, 14, 4.5),
    (10, 12, 4.0),
    (8, 9, 3.5),
    (6, 7, 3.0),
    (4, 5, 2.5),
    (2, 3, 2.0),
    (1, 1, 1.0),
]

GENERAL_READING_BANDS = [
    (40, 40, 9.0),
    (39, 39, 8.5),
    (37, 38, 8.0),
    (36, 36, 7.5),
    (35, 35, 7.0),
    (32, 34, 6.5),
    (30, 31, 6.0),
    (27, 29, 5.5),
    (23, 26, 5.0),
    (19, 22, 4.5),
    (15, 18, 4.0),
    (12, 14, 3.5),
    (9, 11, 3.0),
    (6, 8, 2.5),
    (3, 5, 2.0),
    (1, 2, 1.0),
]


def band_from_raw_score(raw_score: int, module_type: str, reading_variant: str = "academic") -> float:
    safe_score = max(0, min(40, int(raw_score)))
    if module_type == "listening":
        mapping = LISTENING_BANDS
    elif module_type == "reading" and reading_variant == "general":
        mapping = GENERAL_READING_BANDS
    else:
        mapping = ACADEMIC_READING_BANDS

    for low, high, band in mapping:
        if low <= safe_score <= high:
            return band
    return 0.0


def round_overall_band(scores: list[float]) -> float:
    if not scores:
        return 0.0
    average = sum(scores) / len(scores)
    return math.floor((average * 2) + 0.5) / 2


def issue_certificate_code() -> str:
    return f"FNX-{datetime.utcnow():%Y%m%d}-{uuid.uuid4().hex[:6].upper()}"


def _heuristic_productive_band(module_type: str, content: str) -> tuple[float, dict, list[str], str]:
    words = re.findall(r"[A-Za-z']+", content or "")
    sentences = re.split(r"(?<=[.!?])\s+", (content or "").strip())
    vocab_size = len({word.lower() for word in words})
    word_count = len(words)
    sentence_count = len([item for item in sentences if item.strip()])
    avg_sentence = word_count / max(1, sentence_count)
    lexical_ratio = vocab_size / max(1, word_count)

    base = 4.5
    if word_count >= (170 if module_type == "writing" else 120):
        base += 0.7
    if lexical_ratio >= 0.58:
        base += 0.5
    if 10 <= avg_sentence <= 24:
        base += 0.4
    if sentence_count >= 5:
        base += 0.4
    if "however" in content.lower() or "although" in content.lower() or "because" in content.lower():
        base += 0.3

    band = round(min(7.0, max(4.0, base)) * 2) / 2
    if module_type == "writing":
        criteria = {
            "task_response": band,
            "coherence_and_cohesion": max(4.0, band - 0.5),
            "lexical_resource": band,
            "grammatical_range_and_accuracy": max(4.0, band - 0.5),
        }
    else:
        criteria = {
            "fluency_and_coherence": band,
            "lexical_resource": max(4.0, band - 0.5),
            "grammatical_range_and_accuracy": max(4.0, band - 0.5),
            "pronunciation": max(4.0, band - 0.5),
        }

    weaknesses = [
        "Gaplar orasidagi bog'lanish hali yetarli darajada tabiiy emas.",
        "Leksika xavfsiz zonada qolib ketgan.",
        "Xato qilmaslik uchun fikr juda qisqa kesilgan.",
    ]
    summary = "Qattiq tekshiruvda bu javob xavfsiz, lekin hali yuqori band uchun bosim yetmaydi."
    return band, criteria, weaknesses, summary


def evaluate_productive_module(
    *,
    module_type: str,
    prompt_text: str,
    answer_text: str,
    target_language: str = "uz",
) -> dict:
    normalized_type = module_type.strip().lower()
    if normalized_type not in {"writing", "speaking"}:
        raise ValueError("Unsupported productive module")

    criteria_keys = (
        "task_response, coherence_and_cohesion, lexical_resource, grammatical_range_and_accuracy"
        if normalized_type == "writing"
        else "fluency_and_coherence, lexical_resource, grammatical_range_and_accuracy, pronunciation"
    )
    system_prompt = (
        "You are a strict IELTS examiner. "
        "Write feedback in Uzbek Latin. "
        "Be severe and honest. Do not inflate scores. "
        "Punish repetition, vague logic, grammar slips, unnatural phrasing and weak development. "
        "Return strict JSON with keys: band_score, criteria, summary, weaknesses, next_steps. "
        f"criteria must contain exactly these keys: {criteria_keys}. "
        "weaknesses and next_steps must be arrays of 3 short strings."
    )
    user_prompt = (
        f"Module: {normalized_type}\n"
        f"Instruction or topic: {prompt_text}\n"
        f"Candidate answer:\n{answer_text}\n"
        f"Response language for feedback: {target_language}\n"
        "Score this like a real examiner who wants evidence before giving 7.0+."
    )

    ai_result = openrouter_json_completion(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=0.2,
        max_tokens=900,
    )
    if isinstance(ai_result, dict) and ai_result.get("criteria"):
        try:
            band_score = round(max(0.0, min(9.0, float(ai_result.get("band_score", 0.0)))) * 2) / 2
        except (TypeError, ValueError):
            band_score = 0.0
        return {
            "module_type": normalized_type,
            "band_score": band_score,
            "criteria": ai_result.get("criteria", {}),
            "summary": ai_result.get("summary", ""),
            "weaknesses": (ai_result.get("weaknesses") or [])[:3],
            "next_steps": (ai_result.get("next_steps") or [])[:3],
            "provider": "openrouter",
        }

    band, criteria, weaknesses, summary = _heuristic_productive_band(normalized_type, answer_text)
    return {
        "module_type": normalized_type,
        "band_score": band,
        "criteria": criteria,
        "summary": summary,
        "weaknesses": weaknesses,
        "next_steps": [
            "Har javobni bitta asosiy fikr atrofida chuqurlashtiring.",
            "Xavfsiz so'zlarni takrorlash o'rniga 2-3 aniq synonym tayyorlang.",
            "Tekshiruvga topshirishdan oldin xatoni ko'z bilan emas, sovuqqon quloq bilan ushlang.",
        ],
        "provider": "heuristic",
    }


def build_certificate_payload(user_name: str, session_id: str, module_scores: dict[str, float], overall_band: float) -> dict:
    return {
        "certificate_code": issue_certificate_code(),
        "user_name": user_name or "Fynex Candidate",
        "session_id": session_id,
        "module_scores": module_scores,
        "overall_band": overall_band,
        "issued_at": datetime.utcnow().isoformat(timespec="seconds"),
    }


def is_certificate_eligible(module_scores: dict[str, float], mode: str) -> bool:
    required = {"reading", "listening", "writing", "speaking"}
    if mode != "certified" or set(module_scores) != required:
        return False
    overall = round_overall_band(list(module_scores.values()))
    return overall >= 7.0 and min(module_scores.values()) >= 7.0
