from __future__ import annotations

import base64
import json
import os
import random
import re
import urllib.error
import urllib.request
import wave
from dataclasses import dataclass
from difflib import SequenceMatcher
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

try:
    from vosk import KaldiRecognizer, Model, SetLogLevel
except Exception:  # pragma: no cover - optional dependency
    KaldiRecognizer = None
    Model = None

    def SetLogLevel(_: int) -> None:
        return None


ROOT_DIR = Path(__file__).resolve().parents[2]

SetLogLevel(-1)
load_dotenv(ROOT_DIR / ".env")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o").strip() or "openai/gpt-4o"
DEFAULT_SITE_URL = os.getenv("WEB_APP_URL", "").strip()
DEFAULT_SITE_NAME = "Fynex IELTS Tutor"
VOSK_MODEL_PATH = os.getenv("VOSK_MODEL_PATH", "").strip()

IELTS_PASSAGES: dict[str, list[dict[str, str]]] = {
    "science": [
        {
            "title": "Clean Energy Habits",
            "text": (
                "Many cities are investing in clean energy to reduce pollution and improve public health. "
                "Scientists explain that small changes in daily energy use can produce meaningful results over time. "
                "For example, better insulation helps homes stay warm in winter and cool in summer. "
                "This reduces electricity consumption and lowers household costs. "
                "As communities adopt practical solutions, environmental awareness becomes part of everyday life."
            ),
        },
        {
            "title": "Learning Through Observation",
            "text": (
                "Researchers often begin with careful observation before making strong conclusions. "
                "They compare patterns, record evidence, and test their ideas in controlled conditions. "
                "This process teaches students to think clearly instead of guessing too quickly. "
                "It also shows why reliable data matters in modern science. "
                "Over time, this habit develops stronger reasoning and more confident communication."
            ),
        },
    ],
    "nature": [
        {
            "title": "Urban Green Spaces",
            "text": (
                "Urban parks are more valuable than many people realize. "
                "They improve air quality, reduce stress, and provide space for families to relax. "
                "In crowded neighborhoods, even a small green area can change the atmosphere of the whole district. "
                "Children are also more likely to stay active when safe outdoor spaces are available. "
                "For this reason, city planners increasingly treat green spaces as an essential public service."
            ),
        },
        {
            "title": "Ocean Protection",
            "text": (
                "Protecting the ocean requires both government action and personal responsibility. "
                "Plastic waste travels long distances and damages marine ecosystems in hidden ways. "
                "Experts warn that short-term convenience often leads to long-term environmental harm. "
                "However, better recycling systems and public education can significantly reduce the problem. "
                "When people understand the consequences, they tend to make more thoughtful choices."
            ),
        },
    ],
    "society": [
        {
            "title": "Digital Communication",
            "text": (
                "Digital communication has made it easier to stay connected across different countries and time zones. "
                "At the same time, it has changed the way people build trust and maintain attention. "
                "Some educators believe that young people now need stronger listening skills than ever before. "
                "Clear communication is no longer only about speaking quickly, but about choosing the right message at the right moment. "
                "In professional life, this skill often creates better teamwork and fewer misunderstandings."
            ),
        },
        {
            "title": "Community Responsibility",
            "text": (
                "Healthy communities are built when people feel responsible not only for themselves, but also for others. "
                "Simple actions such as mentoring younger students or helping neighbors can strengthen social trust. "
                "These habits may seem small, yet they create a culture of reliability. "
                "As a result, people become more willing to cooperate during difficult periods. "
                "Strong communities usually grow from consistent everyday behavior rather than dramatic gestures."
            ),
        },
    ],
}

FALLBACK_VOCAB = {
    "insulation": {
        "uz_meaning": "Issiqlikni yoki sovuqni ushlab turuvchi himoya qatlami.",
        "synonyms": ["protection", "covering", "thermal layer"],
    },
    "awareness": {
        "uz_meaning": "Biror masalani anglash va unga hushyor qarash holati.",
        "synonyms": ["understanding", "attention", "consciousness"],
    },
    "ecosystems": {
        "uz_meaning": "Tabiatdagi o'zaro bog'langan tirik va jonsiz muhitlar tizimi.",
        "synonyms": ["habitats", "natural systems", "biological communities"],
    },
    "reliable": {
        "uz_meaning": "Ishonchli, barqaror va tekshirilgan.",
        "synonyms": ["trustworthy", "dependable", "consistent"],
    },
}


@dataclass(slots=True)
class TutorAnalysis:
    transcript: str
    matched_words: list[str]
    missed_words: list[str]
    ratio: float
    band_score: float
    summary: str
    tips: list[str]


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z']+", (text or "").lower())


def _split_sentences(text: str) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def _parse_json_like(text: str) -> dict | None:
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.S)
        if not match:
            return None
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return None


def _openrouter_request(
    system_prompt: str,
    user_prompt: str,
    *,
    temperature: float = 0.6,
    max_tokens: int = 700,
) -> dict | None:
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    if not api_key:
        return None

    payload = {
        "model": DEFAULT_OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    request = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": DEFAULT_SITE_URL or "https://fynex.local",
            "X-Title": DEFAULT_SITE_NAME,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return None

    choices = raw.get("choices") or []
    if not choices:
        return None
    content = choices[0].get("message", {}).get("content", "")
    return _parse_json_like(content)


def generate_ielts_passage(topic: str | None = None, skill: str = "speaking") -> dict:
    normalized_topic = (topic or "").strip().lower()
    if normalized_topic not in IELTS_PASSAGES:
        normalized_topic = random.choice(list(IELTS_PASSAGES.keys()))

    system_prompt = (
        "You generate short IELTS practice passages for speaking and reading. "
        "Return strict JSON with keys: title, topic, skill, text, difficult_words. "
        "The text must have 5 or 6 sentences and be suitable for intermediate to upper-intermediate learners."
    )
    user_prompt = (
        f"Create one IELTS-style {skill} passage on the topic '{normalized_topic}'. "
        "Choose a fresh angle. difficult_words must be an array of 4 to 6 useful words from the passage."
    )
    generated = _openrouter_request(system_prompt, user_prompt, temperature=0.8, max_tokens=800)
    if generated and generated.get("text"):
        words = generated.get("difficult_words") or _pick_difficult_words(generated["text"])
        return {
            "title": generated.get("title", "IELTS Practice"),
            "topic": generated.get("topic", normalized_topic.title()),
            "skill": generated.get("skill", skill),
            "text": generated["text"],
            "sentences": _split_sentences(generated["text"]),
            "difficult_words": words,
            "provider": "openrouter",
        }

    fallback = random.choice(IELTS_PASSAGES[normalized_topic])
    return {
        "title": fallback["title"],
        "topic": normalized_topic.title(),
        "skill": skill,
        "text": fallback["text"],
        "sentences": _split_sentences(fallback["text"]),
        "difficult_words": _pick_difficult_words(fallback["text"]),
        "provider": "fallback",
    }


def _pick_difficult_words(text: str) -> list[str]:
    words = _tokenize(text)
    uniq = []
    for word in words:
        if len(word) < 7:
            continue
        if word not in uniq:
            uniq.append(word)
        if len(uniq) == 5:
            break
    return uniq[:5]


def explain_vocabulary(word: str, language: str = "uz", context: str = "") -> dict:
    normalized_word = re.sub(r"[^a-zA-Z'-]", "", word or "").lower()
    if not normalized_word:
        return {"word": word, "meaning": "", "synonyms": []}

    system_prompt = (
        "You explain English vocabulary to language learners. "
        "Return strict JSON with keys: word, uz_meaning, en_meaning, synonyms. "
        "synonyms must contain exactly 3 English items."
    )
    user_prompt = (
        f"Explain the IELTS word '{normalized_word}'. "
        f"Context: {context or 'general usage'}. "
        f"Target output language helper: {language}."
    )
    generated = _openrouter_request(system_prompt, user_prompt, temperature=0.3, max_tokens=300)
    if generated:
        meaning = generated.get("uz_meaning") if language == "uz" else generated.get("en_meaning") or generated.get("uz_meaning")
        return {
            "word": generated.get("word", normalized_word),
            "meaning": meaning or "",
            "synonyms": (generated.get("synonyms") or [])[:3],
            "provider": "openrouter",
        }

    fallback = FALLBACK_VOCAB.get(
        normalized_word,
        {
            "uz_meaning": f"{normalized_word} so'zi uchun AI izoh vaqtincha tayyor emas.",
            "synonyms": ["similar word", "related term", "close meaning"],
        },
    )
    return {
        "word": normalized_word,
        "meaning": fallback["uz_meaning"],
        "synonyms": fallback["synonyms"][:3],
        "provider": "fallback",
    }


def _heuristic_tips(expected_words: list[str], missed_words: list[str]) -> list[str]:
    tips: list[str] = []
    if any(word.startswith("th") for word in expected_words):
        tips.append("'th' tovushini sekin va aniq aytishga e'tibor bering.")
    if any(word.endswith("ed") for word in expected_words):
        tips.append("-ed qo'shimchasini gap oxirida yutib yubormang.")
    if missed_words:
        tips.append("Uzun so'zlarni bo'g'inlarga bo'lib sekinroq takrorlang.")
    if not tips:
        tips.append("Gap oxirlarida intonatsiyani tushirishni mashq qiling.")
    return tips[:3]


def _heuristic_band(ratio: float) -> float:
    if ratio >= 0.95:
        return 8.0
    if ratio >= 0.88:
        return 7.0
    if ratio >= 0.78:
        return 6.5
    if ratio >= 0.68:
        return 6.0
    if ratio >= 0.55:
        return 5.5
    return 5.0


def _compare_expected_and_spoken(expected_text: str, transcript: str) -> tuple[list[str], list[str], float]:
    expected_words = _tokenize(expected_text)
    spoken_words = _tokenize(transcript)
    if not expected_words:
        return [], [], 0.0

    matched: list[str] = []
    spoken_index = 0
    for word in expected_words:
        found = False
        for index in range(spoken_index, len(spoken_words)):
            similarity = SequenceMatcher(a=word, b=spoken_words[index]).ratio()
            if similarity >= 0.78:
                matched.append(word)
                spoken_index = index + 1
                found = True
                break
        if not found:
            continue

    matched_set = set(matched)
    missed = [word for word in expected_words if word not in matched_set]
    ratio = len(matched) / len(expected_words)
    return matched, missed, ratio


def analyze_pronunciation(expected_text: str, transcript: str) -> TutorAnalysis:
    expected_words = _tokenize(expected_text)
    matched_words, missed_words, ratio = _compare_expected_and_spoken(expected_text, transcript)
    band_score = _heuristic_band(ratio)
    summary = "Good rhythm overall. Keep your word endings clear and steady."
    tips = _heuristic_tips(expected_words, missed_words)

    system_prompt = (
        "You are an IELTS speaking examiner. "
        "Return strict JSON with keys: band_score, summary, tips. "
        "Band score must be a number from 5.0 to 8.5. tips must contain 2 or 3 concise items."
    )
    user_prompt = (
        f"Expected text: {expected_text}\n"
        f"Student transcript: {transcript}\n"
        f"Missed words: {', '.join(missed_words[:12]) or 'none'}\n"
        "Give warm, practical pronunciation feedback."
    )
    generated = _openrouter_request(system_prompt, user_prompt, temperature=0.4, max_tokens=400)
    if generated:
        try:
            band_score = float(generated.get("band_score", band_score))
        except (TypeError, ValueError):
            pass
        summary = generated.get("summary") or summary
        tips = [tip for tip in (generated.get("tips") or tips) if tip][:3]

    return TutorAnalysis(
        transcript=transcript,
        matched_words=matched_words,
        missed_words=missed_words,
        ratio=ratio,
        band_score=band_score,
        summary=summary,
        tips=tips,
    )


@lru_cache(maxsize=1)
def _load_vosk_model() -> object | None:
    if not Model or not VOSK_MODEL_PATH:
        return None
    model_path = Path(VOSK_MODEL_PATH)
    if not model_path.exists():
        return None
    try:
        return Model(str(model_path))
    except Exception:
        return None


def vosk_status(*, load_model: bool = False) -> dict:
    model_path = Path(VOSK_MODEL_PATH) if VOSK_MODEL_PATH else None
    is_installed = bool(Model and KaldiRecognizer)
    is_available = bool(model_path and model_path.exists() and model_path.is_dir())

    status = {
        "enabled": bool(is_installed and is_available),
        "installed": is_installed,
        "model_found": is_available,
        "loaded": False,
        "model_path": VOSK_MODEL_PATH,
    }
    if not load_model or not status["enabled"]:
        return status

    model = _load_vosk_model()
    status["enabled"] = bool(model)
    status["loaded"] = bool(model)
    return {
        **status,
    }


def transcribe_audio_base64(audio_base64: str) -> str | None:
    model = _load_vosk_model()
    if not model or not audio_base64 or not KaldiRecognizer:
        return None

    try:
        audio_bytes = base64.b64decode(audio_base64)
    except Exception:
        return None

    try:
        with wave.open(Path("/dev/null"), "rb"):
            pass
    except Exception:
        pass

    try:
        import io

        with wave.open(io.BytesIO(audio_bytes), "rb") as wav_file:
            if wav_file.getnchannels() != 1 or wav_file.getsampwidth() != 2:
                return None
            recognizer = KaldiRecognizer(model, wav_file.getframerate())
            transcript_parts: list[str] = []
            while True:
                chunk = wav_file.readframes(4000)
                if not chunk:
                    break
                if recognizer.AcceptWaveform(chunk):
                    result = json.loads(recognizer.Result())
                    if result.get("text"):
                        transcript_parts.append(result["text"])
            final_result = json.loads(recognizer.FinalResult())
            if final_result.get("text"):
                transcript_parts.append(final_result["text"])
    except Exception:
        return None

    combined = " ".join(part.strip() for part in transcript_parts if part.strip()).strip()
    return combined or None
