from __future__ import annotations

import json
import uuid
from datetime import date, datetime, timedelta
from typing import Any

import aiosqlite

from app.services.rankings import DEFAULT_BOTS, DEFAULT_LOCATIONS


DEFAULT_LESSONS = [
    {
        "subject": "english",
        "level": "beginner",
        "day_number": 1,
        "content": "Bugungi test dars: 5 ta oddiy salomlashuv iborasini o'rganing va talaffuz qiling.",
        "task": "Hello, Hi, Good morning, Good afternoon, Good evening iboralaridan 3 tasini yozing.",
    },
    {
        "subject": "english",
        "level": "elementary",
        "day_number": 1,
        "content": "Bugungi test dars: o'zingizni qisqa tanishtirish uchun 3 ta sodda gap tuzing.",
        "task": "Ismingiz, yoshingiz va qiziqishingiz haqida inglizcha 3 gap yozing.",
    },
    {
        "subject": "english",
        "level": "intermediate",
        "day_number": 1,
        "content": "Bugungi test dars: present simple va present continuous farqini qisqa misollar bilan ko'rib chiqing.",
        "task": "Har bir zamon uchun bittadan gap yozing.",
    },
    {
        "subject": "english",
        "level": "advanced",
        "day_number": 1,
        "content": "Bugungi test dars: murakkab fikrni aniq ifodalash uchun linking words ishlatishni mashq qiling.",
        "task": "However, therefore va moreover so'zlari bilan 3 ta gap yozing.",
    },
    {
        "subject": "math",
        "level": "zero",
        "day_number": 1,
        "content": "Bugungi test dars: sonlar va oddiy arifmetik amallarni mustahkamlang.",
        "task": "12 + 8, 20 - 7 va 6 x 3 misollarini yeching.",
    },
    {
        "subject": "programming",
        "level": "zero",
        "day_number": 1,
        "content": "Bugungi test dars: dasturlash nima ekanini va algoritm tushunchasini qisqa anglab oling.",
        "task": "Choy damlash jarayonini 4 qadamli algoritm sifatida yozing.",
    },
    {
        "subject": "russian",
        "level": "zero",
        "day_number": 1,
        "content": "Bugungi test dars: rus tilidagi eng oddiy salomlashuv va tanishuv iboralarini ko'rib chiqing.",
        "task": "Privet, Zdravstvuyte va Menya zovut iboralaridan foydalanib 2 ta gap yozing.",
    },
    {
        "subject": "logic",
        "level": "zero",
        "day_number": 1,
        "content": "Bugungi test dars: oddiy mantiqiy ketma-ketlikni aniqlashga e'tibor qarating.",
        "task": "2, 4, 8, 16 ketma-ketligidan keyingi 2 sonni yozing.",
    },
    {
        "subject": "physics",
        "level": "zero",
        "day_number": 1,
        "content": "Bugungi test dars: harakat va tezlik tushunchalarining asosiy farqini bilib oling.",
        "task": "Tezlik nima ekanini o'zingizning so'zlaringiz bilan 1-2 gapda yozing.",
    },
]

DEFAULT_ADMIN_SETTINGS = {
    "subscription_enabled": True,
    "monthly_price": 19,
    "quarterly_price": 49,
    "yearly_price": 159,
    "bot_count": 8,
    "bot_score_bias": 0,
}

DEFAULT_FYNEX_COURSES = [
    {
        "slug": "english-beginner",
        "title": "Ingliz tili",
        "description": "Beginner darajasi uchun speaking, grammar va reading asoslari.",
        "theme": "english",
        "visual_type": "liquid_target",
        "target_label": "Beginner",
        "is_visible": 0,
        "units": [
            {
                "order": 1,
                "title": "Beginner Unit",
                "description": "Nouns va verbs asoslari",
                "lessons": [
                    {
                        "order": 1,
                        "title": "English Beginner: Nouns & Verbs",
                        "image_hint": "🇬🇧",
                        "audio_hint": "english beginner",
                        "intro_vocab": [
                            {"word": "student", "translation": "talaba", "type": "noun", "audio_text": "student"},
                            {"word": "teacher", "translation": "o'qituvchi", "type": "noun", "audio_text": "teacher"},
                            {"word": "study", "translation": "o'rganmoq", "type": "verb", "audio_text": "study"},
                            {"word": "improve", "translation": "yaxshilamoq", "type": "verb", "audio_text": "improve"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "Qaysi so'z noun hisoblanadi?",
                                "prompt_text": "Choose the noun.",
                                "explanation": "Noun odam, joy yoki narsani bildiradi.",
                                "options": [
                                    {"text": "student", "correct": True, "image_hint": "🎓", "audio_text": "student"},
                                    {"text": "study", "correct": False, "image_hint": "📘", "audio_text": "study"},
                                    {"text": "improve", "correct": False, "image_hint": "📈", "audio_text": "improve"},
                                ],
                            },
                            {
                                "type": "SELECT",
                                "question": "Qaysi so'z verb hisoblanadi?",
                                "prompt_text": "Choose the verb.",
                                "explanation": "Verb harakatni bildiradi.",
                                "options": [
                                    {"text": "teacher", "correct": False, "image_hint": "👩‍🏫", "audio_text": "teacher"},
                                    {"text": "study", "correct": True, "image_hint": "✍️", "audio_text": "study"},
                                    {"text": "student", "correct": False, "image_hint": "🧑‍🎓", "audio_text": "student"},
                                ],
                            },
                            {
                                "type": "LISTENING",
                                "question": "Audio ni tinglang va to'g'ri javobni tanlang.",
                                "prompt_text": "improve",
                                "explanation": "Improve yaxshilash ma'nosini beradi.",
                                "options": [
                                    {"text": "teacher", "correct": False, "image_hint": "👨‍🏫", "audio_text": "teacher"},
                                    {"text": "improve", "correct": True, "image_hint": "🚀", "audio_text": "improve"},
                                    {"text": "student", "correct": False, "image_hint": "🧑", "audio_text": "student"},
                                ],
                            },
                            {
                                "type": "SPEAKING",
                                "question": "Quyidagi iborani ovoz chiqarib takrorlang: I study every day.",
                                "prompt_text": "I study every day.",
                                "explanation": "Gapni aniq va ravon takrorlang.",
                                "options": [
                                    {"text": "Done", "correct": True, "image_hint": "🎙️", "audio_text": "I study every day."},
                                ],
                            },
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "english-elementary",
        "title": "Ingliz tili",
        "description": "Elementary darajasi uchun self-introduction va simple tenses.",
        "theme": "english",
        "visual_type": "liquid_target",
        "target_label": "Elementary",
        "is_visible": 0,
        "units": [
            {
                "order": 1,
                "title": "Elementary Unit",
                "description": "Tanishtirish va simple sentences",
                "lessons": [
                    {
                        "order": 1,
                        "title": "English Elementary: Introductions",
                        "image_hint": "🇬🇧",
                        "audio_hint": "english elementary",
                        "intro_vocab": [
                            {"word": "city", "translation": "shahar", "type": "noun", "audio_text": "city"},
                            {"word": "family", "translation": "oila", "type": "noun", "audio_text": "family"},
                            {"word": "live", "translation": "yashamoq", "type": "verb", "audio_text": "live"},
                            {"word": "enjoy", "translation": "yoqtirmoq", "type": "verb", "audio_text": "enjoy"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "Qaysi so'z verb?",
                                "prompt_text": "Choose the verb.",
                                "explanation": "Live harakatni bildiradi.",
                                "options": [
                                    {"text": "live", "correct": True, "image_hint": "🏠", "audio_text": "live"},
                                    {"text": "family", "correct": False, "image_hint": "👨‍👩‍👧", "audio_text": "family"},
                                    {"text": "city", "correct": False, "image_hint": "🏙️", "audio_text": "city"},
                                ],
                            },
                            {
                                "type": "ASSIST",
                                "question": "Gapni to'ldiring: I ___ in Tashkent.",
                                "prompt_text": "Fill the blank.",
                                "explanation": "Live mos keladi.",
                                "options": [
                                    {"text": "live", "correct": True, "image_hint": "📍", "audio_text": "live"},
                                    {"text": "city", "correct": False, "image_hint": "🏙️", "audio_text": "city"},
                                    {"text": "family", "correct": False, "image_hint": "👪", "audio_text": "family"},
                                ],
                            },
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "english-intermediate",
        "title": "Ingliz tili",
        "description": "Intermediate darajasi uchun fikr bildirish va connectors.",
        "theme": "english",
        "visual_type": "liquid_target",
        "target_label": "Intermediate",
        "is_visible": 0,
        "units": [
            {
                "order": 1,
                "title": "Intermediate Unit",
                "description": "Connectors va opinion building",
                "lessons": [
                    {
                        "order": 1,
                        "title": "English Intermediate: Opinions",
                        "image_hint": "🇬🇧",
                        "audio_hint": "english intermediate",
                        "intro_vocab": [
                            {"word": "although", "translation": "garchi", "type": "connector", "audio_text": "although"},
                            {"word": "however", "translation": "biroq", "type": "connector", "audio_text": "however"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "Qaysi biri connector?",
                                "prompt_text": "Choose the connector.",
                                "explanation": "However bog'lovchi vazifasida keladi.",
                                "options": [
                                    {"text": "however", "correct": True, "image_hint": "🔗", "audio_text": "however"},
                                    {"text": "student", "correct": False, "image_hint": "🎓", "audio_text": "student"},
                                    {"text": "study", "correct": False, "image_hint": "📘", "audio_text": "study"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "english-upper-intermediate",
        "title": "Ingliz tili",
        "description": "Upper-Intermediate darajasi uchun advanced speaking structure.",
        "theme": "english",
        "visual_type": "liquid_target",
        "target_label": "Upper-Intermediate",
        "is_visible": 0,
        "units": [
            {
                "order": 1,
                "title": "Upper-Intermediate Unit",
                "description": "Argument va structure",
                "lessons": [
                    {
                        "order": 1,
                        "title": "English Upper-Intermediate: Clear Arguments",
                        "image_hint": "🇬🇧",
                        "audio_hint": "upper intermediate",
                        "intro_vocab": [
                            {"word": "argument", "translation": "dalil", "type": "noun", "audio_text": "argument"},
                            {"word": "clarify", "translation": "aniqlashtirmoq", "type": "verb", "audio_text": "clarify"},
                        ],
                        "challenges": [
                            {
                                "type": "SPEAKING",
                                "question": "Qisqa argument ayting: Online education can be effective.",
                                "prompt_text": "Online education can be effective.",
                                "explanation": "2-3 gap bilan fikringizni ayting.",
                                "options": [{"text": "Done", "correct": True, "image_hint": "🎙️", "audio_text": "Online education can be effective."}],
                            }
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "english-advanced",
        "title": "Ingliz tili",
        "description": "Advanced darajasi uchun precision va nuanced writing/speaking.",
        "theme": "english",
        "visual_type": "liquid_target",
        "target_label": "Advanced",
        "is_visible": 0,
        "units": [
            {
                "order": 1,
                "title": "Advanced Unit",
                "description": "Precision va nuance",
                "lessons": [
                    {
                        "order": 1,
                        "title": "English Advanced: Precision",
                        "image_hint": "🇬🇧",
                        "audio_hint": "advanced english",
                        "intro_vocab": [
                            {"word": "nuance", "translation": "nozik farq", "type": "noun", "audio_text": "nuance"},
                            {"word": "articulate", "translation": "aniq ifodalamoq", "type": "verb", "audio_text": "articulate"},
                        ],
                        "challenges": [
                            {
                                "type": "LISTENING",
                                "question": "Audio ni tinglang va to'g'ri so'zni tanlang.",
                                "prompt_text": "nuance",
                                "explanation": "Nuance nozik farq ma'nosini beradi.",
                                "options": [
                                    {"text": "nuance", "correct": True, "image_hint": "🎯", "audio_text": "nuance"},
                                    {"text": "student", "correct": False, "image_hint": "🎓", "audio_text": "student"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "math",
        "title": "Matematika",
        "description": "Asosiy arithmetic va mantiqiy misollar.",
        "theme": "math",
        "visual_type": "wave_progress",
        "target_label": "Progress",
        "is_visible": 1,
        "units": [
            {
                "order": 1,
                "title": "Asosiy unit",
                "description": "Sonlar va oddiy amallar",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Matematika: Asosiy amallar",
                        "image_hint": "🔢",
                        "audio_hint": "math basics",
                        "intro_vocab": [
                            {"word": "sum", "translation": "yig'indi", "type": "term", "audio_text": "sum"},
                            {"word": "divide", "translation": "bo'lmoq", "type": "verb", "audio_text": "divide"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "12 + 8 nechiga teng?",
                                "prompt_text": "12 + 8",
                                "explanation": "12 va 8 yig'indisi 20.",
                                "options": [
                                    {"text": "20", "correct": True, "image_hint": "✅", "audio_text": "twenty"},
                                    {"text": "18", "correct": False, "image_hint": "❌", "audio_text": "eighteen"},
                                    {"text": "22", "correct": False, "image_hint": "❌", "audio_text": "twenty two"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "physics",
        "title": "Fizika",
        "description": "Harakat, tezlik va kuch asoslari.",
        "theme": "physics",
        "visual_type": "wave_progress",
        "target_label": "Progress",
        "is_visible": 1,
        "units": [
            {
                "order": 1,
                "title": "Asosiy unit",
                "description": "Harakat va tezlik",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Fizika: Tezlik nima?",
                        "image_hint": "🧪",
                        "audio_hint": "speed basics",
                        "intro_vocab": [
                            {"word": "speed", "translation": "tezlik", "type": "noun", "audio_text": "speed"},
                            {"word": "distance", "translation": "masofa", "type": "noun", "audio_text": "distance"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "Tezlik nimalarga bog'liq?",
                                "prompt_text": "Choose the best answer.",
                                "explanation": "Masofa va vaqt bilan ifodalanadi.",
                                "options": [
                                    {"text": "Masofa va vaqt", "correct": True, "image_hint": "🚗", "audio_text": "distance and time"},
                                    {"text": "Faqat massa", "correct": False, "image_hint": "⚖️", "audio_text": "mass only"},
                                    {"text": "Faqat rang", "correct": False, "image_hint": "🎨", "audio_text": "color only"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "programming",
        "title": "Dasturlash",
        "description": "Algorithm, syntax va coding thinking asoslari.",
        "theme": "programming",
        "visual_type": "wave_progress",
        "target_label": "Progress",
        "is_visible": 1,
        "units": [
            {
                "order": 1,
                "title": "Asosiy unit",
                "description": "Algorithm va logic",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Dasturlash: Algorithm basics",
                        "image_hint": "💻",
                        "audio_hint": "programming basics",
                        "intro_vocab": [
                            {"word": "algorithm", "translation": "algoritm", "type": "noun", "audio_text": "algorithm"},
                            {"word": "repeat", "translation": "takrorlamoq", "type": "verb", "audio_text": "repeat"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "Algorithm nima?",
                                "prompt_text": "Choose the best answer.",
                                "explanation": "Muammoni yechish uchun qadamlar ketma-ketligi.",
                                "options": [
                                    {"text": "Qadamlar ketma-ketligi", "correct": True, "image_hint": "🧩", "audio_text": "steps"},
                                    {"text": "Rasm chizish usuli", "correct": False, "image_hint": "🎨", "audio_text": "drawing"},
                                    {"text": "Faqat rang", "correct": False, "image_hint": "🌈", "audio_text": "color"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "russian",
        "title": "Rus tili",
        "description": "Oddiy iboralar, salomlashuv va tanishtirish.",
        "theme": "russian",
        "visual_type": "wave_progress",
        "target_label": "Progress",
        "is_visible": 1,
        "units": [
            {
                "order": 1,
                "title": "Asosiy unit",
                "description": "Salomlashuv",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Rus tili: Salomlashuv",
                        "image_hint": "🇷🇺",
                        "audio_hint": "russian greeting",
                        "intro_vocab": [
                            {"word": "Privet", "translation": "salom", "type": "phrase", "audio_text": "Привет"},
                            {"word": "Spasibo", "translation": "rahmat", "type": "phrase", "audio_text": "Спасибо"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "\"Rahmat\" rus tilida qaysi biri?",
                                "prompt_text": "Choose the phrase.",
                                "explanation": "Spasibo - rahmat.",
                                "options": [
                                    {"text": "Spasibo", "correct": True, "image_hint": "🙏", "audio_text": "Спасибо"},
                                    {"text": "Privet", "correct": False, "image_hint": "👋", "audio_text": "Привет"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
    {
        "slug": "logic",
        "title": "Mantiqiy fikrlash",
        "description": "Pattern, ketma-ketlik va reasoning mashqlari.",
        "theme": "logic",
        "visual_type": "wave_progress",
        "target_label": "Progress",
        "is_visible": 1,
        "units": [
            {
                "order": 1,
                "title": "Asosiy unit",
                "description": "Ketma-ketliklar",
                "lessons": [
                    {
                        "order": 1,
                        "title": "Mantiq: Patterns",
                        "image_hint": "🧠",
                        "audio_hint": "logic patterns",
                        "intro_vocab": [
                            {"word": "pattern", "translation": "naqsh / ketma-ketlik", "type": "term", "audio_text": "pattern"},
                            {"word": "sequence", "translation": "ketma-ketlik", "type": "term", "audio_text": "sequence"},
                        ],
                        "challenges": [
                            {
                                "type": "SELECT",
                                "question": "2, 4, 8, 16 dan keyingi son qaysi?",
                                "prompt_text": "Choose the next number.",
                                "explanation": "Har safar 2 barobar bo'lmoqda.",
                                "options": [
                                    {"text": "32", "correct": True, "image_hint": "✅", "audio_text": "thirty two"},
                                    {"text": "24", "correct": False, "image_hint": "❌", "audio_text": "twenty four"},
                                    {"text": "30", "correct": False, "image_hint": "❌", "audio_text": "thirty"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    },
]


class Database:
    def __init__(self, path: str) -> None:
        self.path = path
        self.connection: aiosqlite.Connection | None = None

    async def connect(self) -> None:
        self.connection = await aiosqlite.connect(self.path)
        self.connection.row_factory = aiosqlite.Row

    async def close(self) -> None:
        if self.connection is not None:
            await self.connection.close()

    async def create_tables(self) -> None:
        assert self.connection is not None
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                language TEXT NOT NULL,
                full_name TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                uses_social_media INTEGER,
                social_platforms TEXT,
                daily_social_time TEXT,
                user_goal TEXT,
                user_free_time TEXT,
                is_holiday INTEGER NOT NULL DEFAULT 0,
                district TEXT NOT NULL DEFAULT 'Mirzo Ulugbek',
                region TEXT NOT NULL DEFAULT 'Toshkent',
                country TEXT NOT NULL DEFAULT 'Uzbekistan',
                study_deadline_text TEXT,
                study_deadline_date TEXT,
                daily_study_minutes INTEGER,
                target_band REAL,
                current_band REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject TEXT NOT NULL,
                level TEXT NOT NULL DEFAULT 'zero',
                day_number INTEGER NOT NULL,
                content TEXT NOT NULL,
                task TEXT NOT NULL,
                UNIQUE(subject, level, day_number)
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS user_course_progress (
                user_id INTEGER NOT NULL,
                subject TEXT NOT NULL,
                level TEXT NOT NULL DEFAULT 'zero',
                current_day INTEGER NOT NULL DEFAULT 1,
                last_completed_day TEXT,
                PRIMARY KEY(user_id, subject)
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS user_streaks (
                user_id INTEGER PRIMARY KEY,
                streak_count INTEGER NOT NULL DEFAULT 0,
                last_completed_day TEXT
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS lesson_completions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject TEXT NOT NULL,
                completed_at TEXT NOT NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS focus_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                minutes INTEGER NOT NULL,
                completed_at TEXT NOT NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS study_strategies (
                user_id INTEGER PRIMARY KEY,
                goal_text TEXT NOT NULL,
                timeframe_text TEXT NOT NULL,
                time_window_days INTEGER NOT NULL,
                deadline_date TEXT,
                daily_minutes INTEGER NOT NULL,
                target_band REAL,
                current_band REAL,
                success_rate INTEGER NOT NULL,
                intensity TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS exam_sessions (
                session_id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                mode TEXT NOT NULL DEFAULT 'practice',
                status TEXT NOT NULL DEFAULT 'active',
                started_at TEXT NOT NULL,
                completed_at TEXT,
                reset_reason TEXT,
                cheating_strikes INTEGER NOT NULL DEFAULT 0,
                total_band REAL,
                certificate_id TEXT
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS exam_module_results (
                session_id TEXT NOT NULL,
                module_type TEXT NOT NULL,
                raw_score REAL,
                band_score REAL NOT NULL,
                payload_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                PRIMARY KEY(session_id, module_type)
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS exam_security_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                event_type TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS certificates (
                certificate_id TEXT PRIMARY KEY,
                session_id TEXT UNIQUE NOT NULL,
                user_id INTEGER NOT NULL,
                overall_band REAL NOT NULL,
                snapshot_json TEXT NOT NULL,
                issued_at TEXT NOT NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS leaderboard_bots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                display_name TEXT NOT NULL,
                district TEXT NOT NULL,
                region TEXT NOT NULL,
                country TEXT NOT NULL,
                is_verified INTEGER NOT NULL DEFAULT 1,
                base_score INTEGER NOT NULL DEFAULT 20,
                growth_rate REAL NOT NULL DEFAULT 0.5,
                avatar_hint TEXT,
                activity_days INTEGER NOT NULL DEFAULT 30,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS admin_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                theme TEXT NOT NULL DEFAULT 'ielts',
                visual_type TEXT NOT NULL DEFAULT 'liquid_target',
                target_label TEXT NOT NULL DEFAULT 'IELTS 7+',
                is_visible INTEGER NOT NULL DEFAULT 1
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_units (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                unit_order INTEGER NOT NULL,
                FOREIGN KEY(course_id) REFERENCES learning_courses(id) ON DELETE CASCADE
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                unit_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                lesson_order INTEGER NOT NULL,
                intro_vocab_json TEXT NOT NULL,
                image_hint TEXT,
                audio_hint TEXT,
                FOREIGN KEY(unit_id) REFERENCES learning_units(id) ON DELETE CASCADE
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_challenges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER NOT NULL,
                challenge_type TEXT NOT NULL,
                question TEXT NOT NULL,
                prompt_text TEXT,
                explanation TEXT,
                challenge_order INTEGER NOT NULL,
                FOREIGN KEY(lesson_id) REFERENCES learning_lessons(id) ON DELETE CASCADE
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_challenge_options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                challenge_id INTEGER NOT NULL,
                option_text TEXT NOT NULL,
                is_correct INTEGER NOT NULL DEFAULT 0,
                image_hint TEXT,
                audio_text TEXT,
                FOREIGN KEY(challenge_id) REFERENCES learning_challenges(id) ON DELETE CASCADE
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_user_progress (
                user_id INTEGER PRIMARY KEY,
                active_course_id INTEGER,
                active_unit_id INTEGER,
                active_lesson_id INTEGER,
                active_challenge_id INTEGER,
                onboarding_completed INTEGER NOT NULL DEFAULT 0,
                learning_level TEXT,
                target_goal TEXT,
                interests_json TEXT,
                xp INTEGER NOT NULL DEFAULT 0,
                energy INTEGER NOT NULL DEFAULT 5,
                FOREIGN KEY(active_course_id) REFERENCES learning_courses(id) ON DELETE SET NULL,
                FOREIGN KEY(active_unit_id) REFERENCES learning_units(id) ON DELETE SET NULL,
                FOREIGN KEY(active_lesson_id) REFERENCES learning_lessons(id) ON DELETE SET NULL,
                FOREIGN KEY(active_challenge_id) REFERENCES learning_challenges(id) ON DELETE SET NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_challenge_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                challenge_id INTEGER NOT NULL,
                selected_option_id INTEGER,
                attempts INTEGER NOT NULL DEFAULT 0,
                completed INTEGER NOT NULL DEFAULT 0,
                completed_at TEXT,
                updated_at TEXT NOT NULL,
                UNIQUE(user_id, challenge_id)
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_lesson_completions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lesson_id INTEGER NOT NULL,
                completed_at TEXT NOT NULL,
                UNIQUE(user_id, lesson_id)
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_activity_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                activity_type TEXT NOT NULL,
                minutes INTEGER NOT NULL DEFAULT 0,
                xp_delta INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            )
            """
        )
        await self.connection.execute(
            """
            CREATE TABLE IF NOT EXISTS learning_custom_scenarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                goal TEXT NOT NULL,
                tasks_json TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        await self._run_migrations()
        await self.seed_lessons()
        await self.seed_admin_settings()
        await self.seed_leaderboard_bots()
        await self.seed_learning_engine()

    async def _run_migrations(self) -> None:
        assert self.connection is not None
        columns = {
            row["name"]
            for row in await (await self.connection.execute("PRAGMA table_info(users)")).fetchall()
        }

        migrations = {
            "user_goal": "ALTER TABLE users ADD COLUMN user_goal TEXT",
            "user_free_time": "ALTER TABLE users ADD COLUMN user_free_time TEXT",
            "is_holiday": "ALTER TABLE users ADD COLUMN is_holiday INTEGER NOT NULL DEFAULT 0",
            "district": "ALTER TABLE users ADD COLUMN district TEXT NOT NULL DEFAULT 'Mirzo Ulugbek'",
            "region": "ALTER TABLE users ADD COLUMN region TEXT NOT NULL DEFAULT 'Toshkent'",
            "country": "ALTER TABLE users ADD COLUMN country TEXT NOT NULL DEFAULT 'Uzbekistan'",
            "study_deadline_text": "ALTER TABLE users ADD COLUMN study_deadline_text TEXT",
            "study_deadline_date": "ALTER TABLE users ADD COLUMN study_deadline_date TEXT",
            "daily_study_minutes": "ALTER TABLE users ADD COLUMN daily_study_minutes INTEGER",
            "target_band": "ALTER TABLE users ADD COLUMN target_band REAL",
            "current_band": "ALTER TABLE users ADD COLUMN current_band REAL",
            "study_level": "ALTER TABLE users ADD COLUMN study_level TEXT",
            "target_goal": "ALTER TABLE users ADD COLUMN target_goal TEXT",
            "interests_json": "ALTER TABLE users ADD COLUMN interests_json TEXT",
        }
        for column_name, statement in migrations.items():
            if column_name not in columns:
                await self.connection.execute(statement)

        if "future_goal" in columns and "user_goal" in columns:
            await self.connection.execute(
                """
                UPDATE users
                SET user_goal = COALESCE(user_goal, future_goal)
                WHERE user_goal IS NULL AND future_goal IS NOT NULL
                """
            )

        learning_course_columns = {
            row["name"]
            for row in await (await self.connection.execute("PRAGMA table_info(learning_courses)")).fetchall()
        }
        if "is_visible" not in learning_course_columns:
            await self.connection.execute("ALTER TABLE learning_courses ADD COLUMN is_visible INTEGER NOT NULL DEFAULT 1")

        await self.connection.commit()

    @staticmethod
    def _now_iso() -> str:
        return datetime.utcnow().isoformat(timespec="seconds")

    @staticmethod
    def _load_json(value: str | None, fallback: Any) -> Any:
        if not value:
            return fallback
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return fallback

    async def get_user_by_id(self, user_id: int) -> aiosqlite.Row | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT user_id, language, full_name, phone_number, uses_social_media,
                   social_platforms, daily_social_time, user_goal, user_free_time, is_holiday,
                   district, region, country, study_deadline_text, study_deadline_date,
                   daily_study_minutes, target_band, current_band, study_level, target_goal, interests_json
            FROM users
            WHERE user_id = ?
            """,
            (user_id,),
        )
        return await cursor.fetchone()

    async def list_users_with_free_time(self) -> list[aiosqlite.Row]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT user_id, language, full_name, user_free_time, is_holiday
            FROM users
            WHERE user_free_time IS NOT NULL AND TRIM(user_free_time) != ''
            """
        )
        return await cursor.fetchall()

    async def list_active_users(self) -> list[aiosqlite.Row]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT user_id, language, full_name, daily_social_time, is_holiday
            FROM users
            """
        )
        return await cursor.fetchall()

    async def seed_lessons(self) -> None:
        assert self.connection is not None
        await self.connection.executemany(
            """
            INSERT OR IGNORE INTO lessons (subject, level, day_number, content, task)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                (
                    lesson["subject"],
                    lesson["level"],
                    lesson["day_number"],
                    lesson["content"],
                    lesson["task"],
                )
                for lesson in DEFAULT_LESSONS
            ],
        )
        await self.connection.commit()

    async def seed_admin_settings(self) -> None:
        assert self.connection is not None
        now = self._now_iso()
        await self.connection.executemany(
            """
            INSERT OR IGNORE INTO admin_settings (key, value, updated_at)
            VALUES (?, ?, ?)
            """,
            [(key, json.dumps(value), now) for key, value in DEFAULT_ADMIN_SETTINGS.items()],
        )
        await self.connection.commit()

    async def seed_leaderboard_bots(self) -> None:
        assert self.connection is not None
        cursor = await self.connection.execute("SELECT COUNT(*) AS total FROM leaderboard_bots")
        row = await cursor.fetchone()
        if row and int(row["total"]) > 0:
            return
        await self.connection.executemany(
            """
            INSERT INTO leaderboard_bots (
                display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
            )
            VALUES (?, ?, ?, ?, 1, ?, ?, 30)
            """,
            [(name, district, region, country, base_score, growth_rate) for name, district, region, country, base_score, growth_rate in DEFAULT_BOTS],
        )
        await self.connection.commit()

    async def ensure_course_progress(self, user_id: int, subject: str, level: str) -> aiosqlite.Row:
        assert self.connection is not None
        current = await self.get_course_progress(user_id, subject)
        if current is None:
            await self.connection.execute(
                """
                INSERT INTO user_course_progress (user_id, subject, level, current_day)
                VALUES (?, ?, ?, 1)
                """,
                (user_id, subject, level),
            )
        elif current["level"] != level:
            await self.connection.execute(
                """
                UPDATE user_course_progress
                SET level = ?, current_day = 1, last_completed_day = NULL
                WHERE user_id = ? AND subject = ?
                """,
                (level, user_id, subject),
            )
        await self.connection.commit()
        progress = await self.get_course_progress(user_id, subject)
        assert progress is not None
        return progress

    async def get_course_progress(self, user_id: int, subject: str) -> aiosqlite.Row | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT user_id, subject, level, current_day, last_completed_day
            FROM user_course_progress
            WHERE user_id = ? AND subject = ?
            """,
            (user_id, subject),
        )
        return await cursor.fetchone()

    async def get_lesson(self, subject: str, level: str, day_number: int) -> aiosqlite.Row | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT id, subject, level, day_number, content, task
            FROM lessons
            WHERE subject = ? AND level = ? AND day_number = ?
            """,
            (subject, level, day_number),
        )
        return await cursor.fetchone()

    async def complete_lesson(self, user_id: int, subject: str) -> tuple[bool, int]:
        assert self.connection is not None
        progress = await self.get_course_progress(user_id, subject)
        if progress is None:
            raise ValueError("Course progress not found")

        today = date.today().isoformat()
        if progress["last_completed_day"] == today:
            streak = await self.get_streak_count(user_id)
            return False, streak

        await self.connection.execute(
            """
            UPDATE user_course_progress
            SET current_day = current_day + 1,
                last_completed_day = ?
            WHERE user_id = ? AND subject = ?
            """,
            (today, user_id, subject),
        )
        await self.connection.execute(
            """
            INSERT INTO lesson_completions (user_id, subject, completed_at)
            VALUES (?, ?, ?)
            """,
            (user_id, subject, today),
        )
        streak = await self._update_streak(user_id, today)
        await self.connection.commit()
        return True, streak

    async def get_streak_count(self, user_id: int) -> int:
        assert self.connection is not None
        cursor = await self.connection.execute(
            "SELECT streak_count FROM user_streaks WHERE user_id = ?",
            (user_id,),
        )
        row = await cursor.fetchone()
        return int(row["streak_count"]) if row else 0

    async def _update_streak(self, user_id: int, today: str) -> int:
        assert self.connection is not None
        cursor = await self.connection.execute(
            "SELECT streak_count, last_completed_day FROM user_streaks WHERE user_id = ?",
            (user_id,),
        )
        row = await cursor.fetchone()
        yesterday = (date.fromisoformat(today) - timedelta(days=1)).isoformat()

        if row is None:
            streak_count = 1
            await self.connection.execute(
                """
                INSERT INTO user_streaks (user_id, streak_count, last_completed_day)
                VALUES (?, ?, ?)
                """,
                (user_id, streak_count, today),
            )
            return streak_count

        if row["last_completed_day"] == today:
            return int(row["streak_count"])

        streak_count = int(row["streak_count"]) + 1 if row["last_completed_day"] == yesterday else 1
        await self.connection.execute(
            """
            UPDATE user_streaks
            SET streak_count = ?, last_completed_day = ?
            WHERE user_id = ?
            """,
            (streak_count, today, user_id),
        )
        return streak_count

    async def reset_user(self, user_id: int) -> None:
        assert self.connection is not None
        tables = [
            "users",
            "user_course_progress",
            "user_streaks",
            "lesson_completions",
            "focus_sessions",
            "study_strategies",
            "exam_module_results",
            "exam_sessions",
            "exam_security_events",
            "certificates",
        ]
        for table in tables:
            column = "user_id" if table != "exam_module_results" else None
            if table == "exam_module_results":
                await self.connection.execute(
                    "DELETE FROM exam_module_results WHERE session_id IN (SELECT session_id FROM exam_sessions WHERE user_id = ?)",
                    (user_id,),
                )
                continue
            await self.connection.execute(f"DELETE FROM {table} WHERE {column} = ?", (user_id,))
        await self.connection.commit()

    async def update_user_free_time(self, user_id: int, free_time: str) -> None:
        assert self.connection is not None
        await self.connection.execute(
            """
            UPDATE users
            SET user_free_time = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            """,
            (free_time, user_id),
        )
        await self.connection.commit()

    async def update_user_language(self, user_id: int, language: str) -> None:
        assert self.connection is not None
        await self.connection.execute(
            """
            UPDATE users
            SET language = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            """,
            (language, user_id),
        )
        await self.connection.commit()

    async def update_user_location(self, user_id: int, district: str, region: str, country: str) -> None:
        assert self.connection is not None
        await self.connection.execute(
            """
            UPDATE users
            SET district = ?, region = ?, country = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            """,
            (district, region, country, user_id),
        )
        await self.connection.commit()

    async def toggle_holiday_mode(self, user_id: int) -> int:
        assert self.connection is not None
        await self.connection.execute(
            """
            UPDATE users
            SET is_holiday = CASE WHEN is_holiday = 1 THEN 0 ELSE 1 END,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            """,
            (user_id,),
        )
        await self.connection.commit()
        user = await self.get_user_by_id(user_id)
        return int(user["is_holiday"]) if user else 0

    async def get_primary_course(self, user_id: int) -> aiosqlite.Row | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT subject, level, current_day
            FROM user_course_progress
            WHERE user_id = ?
            ORDER BY subject ASC
            LIMIT 1
            """,
            (user_id,),
        )
        return await cursor.fetchone()

    async def list_user_courses(self, user_id: int) -> list[aiosqlite.Row]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT subject, level, current_day
            FROM user_course_progress
            WHERE user_id = ?
            ORDER BY subject ASC
            """,
            (user_id,),
        )
        return await cursor.fetchall()

    async def count_completed_lessons(self, user_id: int) -> int:
        assert self.connection is not None
        cursor = await self.connection.execute(
            "SELECT COUNT(*) AS total FROM lesson_completions WHERE user_id = ?",
            (user_id,),
        )
        row = await cursor.fetchone()
        return int(row["total"]) if row else 0

    async def count_weekly_lessons(self, user_id: int, start_date: str, end_date: str) -> int:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT COUNT(*) AS total
            FROM lesson_completions
            WHERE user_id = ? AND completed_at BETWEEN ? AND ?
            """,
            (user_id, start_date, end_date),
        )
        row = await cursor.fetchone()
        return int(row["total"]) if row else 0

    async def add_focus_session(self, user_id: int, minutes: int = 25) -> None:
        assert self.connection is not None
        today = date.today().isoformat()
        await self.connection.execute(
            """
            INSERT INTO focus_sessions (user_id, minutes, completed_at)
            VALUES (?, ?, ?)
            """,
            (user_id, minutes, today),
        )
        await self.connection.commit()

    async def count_focus_minutes(self, user_id: int) -> int:
        assert self.connection is not None
        cursor = await self.connection.execute(
            "SELECT COALESCE(SUM(minutes), 0) AS total FROM focus_sessions WHERE user_id = ?",
            (user_id,),
        )
        row = await cursor.fetchone()
        return int(row["total"]) if row else 0

    async def upsert_user_profile(self, payload: dict) -> None:
        assert self.connection is not None
        await self.connection.execute(
            """
            INSERT INTO users (
                user_id,
                language,
                full_name,
                phone_number,
                uses_social_media,
                social_platforms,
                daily_social_time,
                user_goal,
                user_free_time,
                is_holiday,
                district,
                region,
                country,
                study_deadline_text,
                study_deadline_date,
                daily_study_minutes,
                target_band,
                current_band,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id) DO UPDATE SET
                language = excluded.language,
                full_name = excluded.full_name,
                phone_number = excluded.phone_number,
                uses_social_media = excluded.uses_social_media,
                social_platforms = excluded.social_platforms,
                daily_social_time = excluded.daily_social_time,
                user_goal = excluded.user_goal,
                user_free_time = COALESCE(excluded.user_free_time, users.user_free_time),
                is_holiday = COALESCE(excluded.is_holiday, users.is_holiday),
                district = COALESCE(excluded.district, users.district),
                region = COALESCE(excluded.region, users.region),
                country = COALESCE(excluded.country, users.country),
                study_deadline_text = COALESCE(excluded.study_deadline_text, users.study_deadline_text),
                study_deadline_date = COALESCE(excluded.study_deadline_date, users.study_deadline_date),
                daily_study_minutes = COALESCE(excluded.daily_study_minutes, users.daily_study_minutes),
                target_band = COALESCE(excluded.target_band, users.target_band),
                current_band = COALESCE(excluded.current_band, users.current_band),
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                payload["user_id"],
                payload["language"],
                payload["full_name"],
                payload.get("phone_number") or "",
                payload.get("uses_social_media"),
                json.dumps(payload.get("social_platforms", []), ensure_ascii=False),
                payload.get("daily_social_time"),
                payload.get("user_goal"),
                payload.get("user_free_time"),
                0 if payload.get("is_holiday") is None else payload.get("is_holiday"),
                payload.get("district", DEFAULT_LOCATIONS["district"]),
                payload.get("region", DEFAULT_LOCATIONS["region"]),
                payload.get("country", DEFAULT_LOCATIONS["country"]),
                payload.get("study_deadline_text"),
                payload.get("study_deadline_date"),
                payload.get("daily_study_minutes"),
                payload.get("target_band"),
                payload.get("current_band"),
            ),
        )
        await self.connection.commit()

    async def ensure_user_exists(self, user_id: int, *, name: str = "Fynex User", language: str = "uz") -> aiosqlite.Row:
        assert self.connection is not None
        user = await self.get_user_by_id(user_id)
        if user:
            return user
        await self.upsert_user_profile(
            {
                "user_id": user_id,
                "language": language,
                "full_name": name,
                "phone_number": "",
                "social_platforms": [],
                "district": DEFAULT_LOCATIONS["district"],
                "region": DEFAULT_LOCATIONS["region"],
                "country": DEFAULT_LOCATIONS["country"],
            }
        )
        user = await self.get_user_by_id(user_id)
        assert user is not None
        return user

    async def save_strategy(self, user_id: int, strategy: dict) -> None:
        assert self.connection is not None
        await self.connection.execute(
            """
            INSERT INTO study_strategies (
                user_id, goal_text, timeframe_text, time_window_days, deadline_date,
                daily_minutes, target_band, current_band, success_rate, intensity,
                payload_json, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                goal_text = excluded.goal_text,
                timeframe_text = excluded.timeframe_text,
                time_window_days = excluded.time_window_days,
                deadline_date = excluded.deadline_date,
                daily_minutes = excluded.daily_minutes,
                target_band = excluded.target_band,
                current_band = excluded.current_band,
                success_rate = excluded.success_rate,
                intensity = excluded.intensity,
                payload_json = excluded.payload_json,
                updated_at = excluded.updated_at
            """,
            (
                user_id,
                strategy.get("goal_text", ""),
                strategy.get("timeframe", {}).get("original_text") or strategy.get("timeframe_text", ""),
                int(strategy.get("timeframe", {}).get("days_available") or strategy.get("time_window_days") or 0),
                strategy.get("timeframe", {}).get("deadline_iso") or strategy.get("deadline_date"),
                int(strategy.get("daily_minutes") or 0),
                strategy.get("target_band"),
                strategy.get("current_band"),
                int(strategy.get("success_rate") or 0),
                strategy.get("focus_mode") or strategy.get("intensity") or "balanced",
                json.dumps(strategy, ensure_ascii=False),
                strategy.get("updated_at") or self._now_iso(),
            ),
        )
        await self.connection.execute(
            """
            UPDATE users
            SET user_goal = ?,
                study_deadline_text = ?,
                study_deadline_date = ?,
                daily_study_minutes = ?,
                target_band = ?,
                current_band = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            """,
            (
                strategy.get("goal_text"),
                strategy.get("timeframe", {}).get("original_text"),
                strategy.get("timeframe", {}).get("deadline_iso"),
                int(strategy.get("daily_minutes") or 0),
                strategy.get("target_band"),
                strategy.get("current_band"),
                user_id,
            ),
        )
        await self.connection.commit()

    async def get_strategy(self, user_id: int) -> dict | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            "SELECT payload_json FROM study_strategies WHERE user_id = ?",
            (user_id,),
        )
        row = await cursor.fetchone()
        return self._load_json(row["payload_json"], None) if row else None

    async def create_exam_session(self, user_id: int, mode: str = "practice") -> dict:
        assert self.connection is not None
        existing = await self.get_active_exam_session(user_id, mode=mode)
        if existing:
            return await self.get_exam_session(existing["session_id"]) or existing

        session_id = uuid.uuid4().hex[:16]
        started_at = self._now_iso()
        await self.connection.execute(
            """
            INSERT INTO exam_sessions (session_id, user_id, mode, status, started_at)
            VALUES (?, ?, ?, 'active', ?)
            """,
            (session_id, user_id, mode, started_at),
        )
        await self.connection.commit()
        session = await self.get_exam_session(session_id)
        assert session is not None
        return session

    async def get_active_exam_session(self, user_id: int, mode: str | None = None) -> aiosqlite.Row | None:
        assert self.connection is not None
        if mode:
            cursor = await self.connection.execute(
                """
                SELECT session_id, user_id, mode, status, started_at, completed_at, reset_reason, cheating_strikes, total_band, certificate_id
                FROM exam_sessions
                WHERE user_id = ? AND mode = ? AND status = 'active'
                ORDER BY started_at DESC
                LIMIT 1
                """,
                (user_id, mode),
            )
        else:
            cursor = await self.connection.execute(
                """
                SELECT session_id, user_id, mode, status, started_at, completed_at, reset_reason, cheating_strikes, total_band, certificate_id
                FROM exam_sessions
                WHERE user_id = ? AND status = 'active'
                ORDER BY started_at DESC
                LIMIT 1
                """,
                (user_id,),
            )
        return await cursor.fetchone()

    async def get_exam_session(self, session_id: str) -> dict | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT session_id, user_id, mode, status, started_at, completed_at, reset_reason, cheating_strikes, total_band, certificate_id
            FROM exam_sessions
            WHERE session_id = ?
            """,
            (session_id,),
        )
        row = await cursor.fetchone()
        if not row:
            return None
        payload = dict(row)
        payload["modules"] = await self.list_exam_module_results(session_id)
        return payload

    async def list_exam_module_results(self, session_id: str) -> dict[str, dict]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT module_type, raw_score, band_score, payload_json, created_at
            FROM exam_module_results
            WHERE session_id = ?
            ORDER BY created_at ASC
            """,
            (session_id,),
        )
        rows = await cursor.fetchall()
        result: dict[str, dict] = {}
        for row in rows:
            payload = self._load_json(row["payload_json"], {})
            payload.setdefault("raw_score", row["raw_score"])
            payload.setdefault("band_score", row["band_score"])
            payload.setdefault("created_at", row["created_at"])
            result[row["module_type"]] = payload
        return result

    async def upsert_exam_module_result(
        self,
        session_id: str,
        module_type: str,
        *,
        raw_score: float | None,
        band_score: float,
        payload: dict,
    ) -> None:
        assert self.connection is not None
        created_at = self._now_iso()
        await self.connection.execute(
            """
            INSERT INTO exam_module_results (session_id, module_type, raw_score, band_score, payload_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(session_id, module_type) DO UPDATE SET
                raw_score = excluded.raw_score,
                band_score = excluded.band_score,
                payload_json = excluded.payload_json,
                created_at = excluded.created_at
            """,
            (
                session_id,
                module_type,
                raw_score,
                band_score,
                json.dumps(payload, ensure_ascii=False),
                created_at,
            ),
        )
        await self.connection.commit()

    async def complete_exam_session(
        self,
        session_id: str,
        *,
        total_band: float,
        status: str,
        certificate_id: str | None = None,
    ) -> None:
        assert self.connection is not None
        await self.connection.execute(
            """
            UPDATE exam_sessions
            SET status = ?, total_band = ?, certificate_id = ?, completed_at = ?
            WHERE session_id = ?
            """,
            (status, total_band, certificate_id, self._now_iso(), session_id),
        )
        await self.connection.commit()

    async def record_exam_security_event(self, session_id: str, user_id: int, event_type: str) -> int:
        assert self.connection is not None
        created_at = self._now_iso()
        await self.connection.execute(
            """
            INSERT INTO exam_security_events (session_id, user_id, event_type, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (session_id, user_id, event_type, created_at),
        )
        await self.connection.commit()
        return await self.count_recent_security_events(session_id, event_type=event_type)

    async def count_recent_security_events(self, session_id: str, *, event_type: str = "exit", window_seconds: int = 60) -> int:
        assert self.connection is not None
        since = (datetime.utcnow() - timedelta(seconds=window_seconds)).isoformat(timespec="seconds")
        cursor = await self.connection.execute(
            """
            SELECT COUNT(*) AS total
            FROM exam_security_events
            WHERE session_id = ? AND event_type = ? AND created_at >= ?
            """,
            (session_id, event_type, since),
        )
        row = await cursor.fetchone()
        return int(row["total"]) if row else 0

    async def reset_exam_session(self, session_id: str, reason: str) -> None:
        assert self.connection is not None
        await self.connection.execute("DELETE FROM exam_module_results WHERE session_id = ?", (session_id,))
        await self.connection.execute(
            """
            UPDATE exam_sessions
            SET status = 'reset',
                total_band = NULL,
                certificate_id = NULL,
                reset_reason = ?,
                completed_at = ?
            WHERE session_id = ?
            """,
            (reason, self._now_iso(), session_id),
        )
        await self.connection.commit()

    async def create_certificate(self, payload: dict, user_id: int) -> dict:
        assert self.connection is not None
        await self.connection.execute(
            """
            INSERT OR REPLACE INTO certificates (certificate_id, session_id, user_id, overall_band, snapshot_json, issued_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                payload["certificate_code"],
                payload["session_id"],
                user_id,
                payload["overall_band"],
                json.dumps(payload, ensure_ascii=False),
                payload["issued_at"],
            ),
        )
        await self.connection.commit()
        return payload

    async def get_latest_certificate(self, user_id: int) -> dict | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT snapshot_json
            FROM certificates
            WHERE user_id = ?
            ORDER BY issued_at DESC
            LIMIT 1
            """,
            (user_id,),
        )
        row = await cursor.fetchone()
        return self._load_json(row["snapshot_json"], None) if row else None

    async def get_latest_overall_band(self, user_id: int) -> float:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT COALESCE(MAX(total_band), 0) AS total
            FROM exam_sessions
            WHERE user_id = ? AND status IN ('submitted', 'certified')
            """,
            (user_id,),
        )
        row = await cursor.fetchone()
        return float(row["total"]) if row and row["total"] is not None else 0.0

    async def list_users_by_scope(self, scope: str, district: str, region: str, country: str) -> list[aiosqlite.Row]:
        assert self.connection is not None
        if scope == "district":
            query = "SELECT user_id, full_name, district, region, country FROM users WHERE district = ? AND region = ? AND country = ?"
            params = (district, region, country)
        elif scope == "region":
            query = "SELECT user_id, full_name, district, region, country FROM users WHERE region = ? AND country = ?"
            params = (region, country)
        elif scope == "country":
            query = "SELECT user_id, full_name, district, region, country FROM users WHERE country = ?"
            params = (country,)
        else:
            query = "SELECT user_id, full_name, district, region, country FROM users"
            params = ()
        cursor = await self.connection.execute(query, params)
        return await cursor.fetchall()

    async def list_bots_by_scope(self, scope: str, district: str, region: str, country: str, limit: int | None = None) -> list[aiosqlite.Row]:
        assert self.connection is not None
        if scope == "district":
            query = """
                SELECT id, display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
                FROM leaderboard_bots
                WHERE district = ? AND region = ? AND country = ?
                ORDER BY base_score DESC, display_name ASC
            """
            params = (district, region, country)
        elif scope == "region":
            query = """
                SELECT id, display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
                FROM leaderboard_bots
                WHERE region = ? AND country = ?
                ORDER BY base_score DESC, display_name ASC
            """
            params = (region, country)
        elif scope == "country":
            query = """
                SELECT id, display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
                FROM leaderboard_bots
                WHERE country = ?
                ORDER BY base_score DESC, display_name ASC
            """
            params = (country,)
        else:
            query = """
                SELECT id, display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
                FROM leaderboard_bots
                ORDER BY base_score DESC, display_name ASC
            """
            params = ()
        if limit:
            query += f" LIMIT {int(limit)}"
        cursor = await self.connection.execute(query, params)
        return await cursor.fetchall()

    async def get_admin_settings(self) -> dict:
        assert self.connection is not None
        cursor = await self.connection.execute("SELECT key, value FROM admin_settings")
        rows = await cursor.fetchall()
        result = DEFAULT_ADMIN_SETTINGS.copy()
        for row in rows:
            result[row["key"]] = self._load_json(row["value"], row["value"])
        return result

    async def update_admin_settings(self, settings: dict) -> dict:
        assert self.connection is not None
        now = self._now_iso()
        for key, value in settings.items():
            await self.connection.execute(
                """
                INSERT INTO admin_settings (key, value, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    value = excluded.value,
                    updated_at = excluded.updated_at
                """,
                (key, json.dumps(value), now),
            )
        await self.connection.commit()
        return await self.get_admin_settings()

    async def list_all_bots(self) -> list[dict]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT id, display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
            FROM leaderboard_bots
            ORDER BY country, region, district, display_name
            """
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]

    async def upsert_bot(self, payload: dict) -> dict:
        assert self.connection is not None
        bot_id = payload.get("id")
        if bot_id:
            await self.connection.execute(
                """
                UPDATE leaderboard_bots
                SET display_name = ?, district = ?, region = ?, country = ?,
                    is_verified = ?, base_score = ?, growth_rate = ?, activity_days = ?
                WHERE id = ?
                """,
                (
                    payload["display_name"],
                    payload.get("district", DEFAULT_LOCATIONS["district"]),
                    payload.get("region", DEFAULT_LOCATIONS["region"]),
                    payload.get("country", DEFAULT_LOCATIONS["country"]),
                    int(payload.get("is_verified", 1)),
                    int(payload.get("base_score", 20)),
                    float(payload.get("growth_rate", 0.5)),
                    int(payload.get("activity_days", 30)),
                    int(bot_id),
                ),
            )
        else:
            await self.connection.execute(
                """
                INSERT INTO leaderboard_bots (
                    display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    payload["display_name"],
                    payload.get("district", DEFAULT_LOCATIONS["district"]),
                    payload.get("region", DEFAULT_LOCATIONS["region"]),
                    payload.get("country", DEFAULT_LOCATIONS["country"]),
                    int(payload.get("is_verified", 1)),
                    int(payload.get("base_score", 20)),
                    float(payload.get("growth_rate", 0.5)),
                    int(payload.get("activity_days", 30)),
                ),
            )
            cursor = await self.connection.execute("SELECT last_insert_rowid() AS bot_id")
            row = await cursor.fetchone()
            bot_id = int(row["bot_id"]) if row else None
        await self.connection.commit()
        cursor = await self.connection.execute(
            """
            SELECT id, display_name, district, region, country, is_verified, base_score, growth_rate, activity_days
            FROM leaderboard_bots
            WHERE id = ?
            """,
            (int(bot_id),),
        )
        row = await cursor.fetchone()
        return dict(row) if row else payload

    async def seed_learning_engine(self) -> None:
        assert self.connection is not None
        for course in DEFAULT_FYNEX_COURSES:
            course_row = await (await self.connection.execute("SELECT id FROM learning_courses WHERE slug = ?", (course["slug"],))).fetchone()
            if course_row:
                continue
            await self.connection.execute(
                """
                INSERT INTO learning_courses (slug, title, description, theme, visual_type, target_label, is_visible)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    course["slug"],
                    course["title"],
                    course["description"],
                    course["theme"],
                    course["visual_type"],
                    course["target_label"],
                    int(course.get("is_visible", 1)),
                ),
            )
            course_row = await (await self.connection.execute("SELECT id FROM learning_courses WHERE slug = ?", (course["slug"],))).fetchone()
            course_id = int(course_row["id"])

            for unit in course["units"]:
                await self.connection.execute(
                    """
                    INSERT INTO learning_units (course_id, title, description, unit_order)
                    VALUES (?, ?, ?, ?)
                    """,
                    (course_id, unit["title"], unit["description"], unit["order"]),
                )
                unit_row = await (
                    await self.connection.execute(
                        "SELECT id FROM learning_units WHERE course_id = ? AND unit_order = ?",
                        (course_id, unit["order"]),
                    )
                ).fetchone()
                unit_id = int(unit_row["id"])

                for lesson in unit["lessons"]:
                    await self.connection.execute(
                        """
                        INSERT INTO learning_lessons (
                            unit_id, title, lesson_order, intro_vocab_json, image_hint, audio_hint
                        )
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (
                            unit_id,
                            lesson["title"],
                            lesson["order"],
                            json.dumps(lesson["intro_vocab"], ensure_ascii=False),
                            lesson.get("image_hint"),
                            lesson.get("audio_hint"),
                        ),
                    )
                    lesson_row = await (
                        await self.connection.execute(
                            "SELECT id FROM learning_lessons WHERE unit_id = ? AND lesson_order = ?",
                            (unit_id, lesson["order"]),
                        )
                    ).fetchone()
                    lesson_id = int(lesson_row["id"])

                    for index, challenge in enumerate(lesson["challenges"], start=1):
                        await self.connection.execute(
                            """
                            INSERT INTO learning_challenges (
                                lesson_id, challenge_type, question, prompt_text, explanation, challenge_order
                            )
                            VALUES (?, ?, ?, ?, ?, ?)
                            """,
                            (
                                lesson_id,
                                challenge["type"],
                                challenge["question"],
                                challenge.get("prompt_text"),
                                challenge.get("explanation"),
                                index,
                            ),
                        )
                        challenge_row = await (
                            await self.connection.execute(
                                "SELECT id FROM learning_challenges WHERE lesson_id = ? AND challenge_order = ?",
                                (lesson_id, index),
                            )
                        ).fetchone()
                        challenge_id = int(challenge_row["id"])
                        await self.connection.executemany(
                            """
                            INSERT INTO learning_challenge_options (
                                challenge_id, option_text, is_correct, image_hint, audio_text
                            )
                            VALUES (?, ?, ?, ?, ?)
                            """,
                            [
                                (
                                    challenge_id,
                                    option["text"],
                                    int(option["correct"]),
                                    option.get("image_hint"),
                                    option.get("audio_text"),
                                )
                                for option in challenge["options"]
                            ],
                        )
        await self.connection.commit()

    async def ensure_learning_user_progress(self, user_id: int) -> dict:
        assert self.connection is not None
        row = await (
            await self.connection.execute(
                """
                SELECT user_id, active_course_id, active_unit_id, active_lesson_id, active_challenge_id,
                       onboarding_completed, learning_level, target_goal, interests_json, xp, energy
                FROM learning_user_progress
                WHERE user_id = ?
                """,
                (user_id,),
            )
        ).fetchone()
        if row:
            return dict(row)

        first_challenge = await self._first_learning_challenge()
        await self.connection.execute(
            """
            INSERT OR IGNORE INTO learning_user_progress (
                user_id, active_course_id, active_unit_id, active_lesson_id, active_challenge_id,
                onboarding_completed, interests_json, xp, energy
            )
            VALUES (?, ?, ?, ?, ?, 0, '[]', 0, 5)
            """,
            (
                user_id,
                first_challenge["course_id"] if first_challenge else None,
                first_challenge["unit_id"] if first_challenge else None,
                first_challenge["lesson_id"] if first_challenge else None,
                first_challenge["challenge_id"] if first_challenge else None,
            ),
        )
        await self.connection.commit()
        row = await (
            await self.connection.execute(
                """
                SELECT user_id, active_course_id, active_unit_id, active_lesson_id, active_challenge_id,
                       onboarding_completed, learning_level, target_goal, interests_json, xp, energy
                FROM learning_user_progress
                WHERE user_id = ?
                """,
                (user_id,),
            )
        ).fetchone()
        return dict(row) if row else {}

    async def _first_learning_challenge(self) -> aiosqlite.Row | None:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT c.id AS course_id, u.id AS unit_id, l.id AS lesson_id, ch.id AS challenge_id
            FROM learning_courses c
            JOIN learning_units u ON u.course_id = c.id
            JOIN learning_lessons l ON l.unit_id = u.id
            JOIN learning_challenges ch ON ch.lesson_id = l.id
            ORDER BY c.id ASC, u.unit_order ASC, l.lesson_order ASC, ch.challenge_order ASC
            LIMIT 1
            """
        )
        return await cursor.fetchone()

    async def save_learning_onboarding(
        self,
        user_id: int,
        *,
        full_name: str,
        phone_number: str,
        language: str,
        learning_level: str,
        target_goal: str,
        interests: list[str],
    ) -> None:
        assert self.connection is not None
        await self.ensure_user_exists(user_id, name=full_name, language=language)
        await self.connection.execute(
            """
            UPDATE users
            SET full_name = ?, phone_number = ?, language = ?, study_level = ?, target_goal = ?, interests_json = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            """,
            (
                full_name,
                phone_number,
                language,
                learning_level,
                target_goal,
                json.dumps(interests, ensure_ascii=False),
                user_id,
            ),
        )
        await self.ensure_learning_user_progress(user_id)
        await self.connection.execute(
            """
            UPDATE learning_user_progress
            SET onboarding_completed = 1,
                learning_level = ?,
                target_goal = ?,
                interests_json = ?
            WHERE user_id = ?
            """,
            (learning_level, target_goal, json.dumps(interests, ensure_ascii=False), user_id),
        )
        await self.connection.commit()

    async def list_learning_courses(self, user_id: int) -> list[dict]:
        assert self.connection is not None
        await self.ensure_learning_user_progress(user_id)
        cursor = await self.connection.execute(
            """
            SELECT c.id, c.slug, c.title, c.description, c.theme, c.visual_type, c.target_label, c.is_visible,
                   COUNT(DISTINCT l.id) AS lesson_count
            FROM learning_courses c
            LEFT JOIN learning_units u ON u.course_id = c.id
            LEFT JOIN learning_lessons l ON l.unit_id = u.id
            WHERE c.is_visible = 1
            GROUP BY c.id
            ORDER BY c.id ASC
            """
        )
        courses = []
        for row in await cursor.fetchall():
            total_challenges_cursor = await self.connection.execute(
                """
                SELECT COUNT(*) AS total
                FROM learning_challenges ch
                JOIN learning_lessons l ON l.id = ch.lesson_id
                JOIN learning_units u ON u.id = l.unit_id
                WHERE u.course_id = ?
                """,
                (row["id"],),
            )
            total_row = await total_challenges_cursor.fetchone()
            completed_cursor = await self.connection.execute(
                """
                SELECT COUNT(*) AS total
                FROM learning_challenge_progress p
                JOIN learning_challenges ch ON ch.id = p.challenge_id
                JOIN learning_lessons l ON l.id = ch.lesson_id
                JOIN learning_units u ON u.id = l.unit_id
                WHERE p.user_id = ? AND p.completed = 1 AND u.course_id = ?
                """,
                (user_id, row["id"]),
            )
            completed_row = await completed_cursor.fetchone()
            total = int(total_row["total"] or 0) if total_row else 0
            completed = int(completed_row["total"] or 0) if completed_row else 0
            progress = round((completed / total) * 100) if total else 0
            courses.append(
                {
                    "id": int(row["id"]),
                    "slug": row["slug"],
                    "title": row["title"],
                    "description": row["description"],
                    "theme": row["theme"],
                    "visual_type": row["visual_type"],
                    "target_label": row["target_label"],
                    "lesson_count": int(row["lesson_count"] or 0),
                    "progress": progress,
                    "completed_challenges": completed,
                    "total_challenges": total,
                }
            )
        hidden_english = [course for course in DEFAULT_FYNEX_COURSES if course["slug"].startswith("english-")]
        english_progress = []
        for hidden in hidden_english:
            row = await (
                await self.connection.execute("SELECT id FROM learning_courses WHERE slug = ?", (hidden["slug"],))
            ).fetchone()
            if not row:
                continue
            hidden_id = int(row["id"])
            total_cursor = await self.connection.execute(
                """
                SELECT COUNT(*) AS total
                FROM learning_challenges ch
                JOIN learning_lessons l ON l.id = ch.lesson_id
                JOIN learning_units u ON u.id = l.unit_id
                WHERE u.course_id = ?
                """,
                (hidden_id,),
            )
            done_cursor = await self.connection.execute(
                """
                SELECT COUNT(*) AS total
                FROM learning_challenge_progress p
                JOIN learning_challenges ch ON ch.id = p.challenge_id
                JOIN learning_lessons l ON l.id = ch.lesson_id
                JOIN learning_units u ON u.id = l.unit_id
                WHERE p.user_id = ? AND p.completed = 1 AND u.course_id = ?
                """,
                (user_id, hidden_id),
            )
            total_row = await total_cursor.fetchone()
            done_row = await done_cursor.fetchone()
            total = int(total_row["total"] or 0) if total_row else 0
            done = int(done_row["total"] or 0) if done_row else 0
            progress = round((done / total) * 100) if total else 0
            english_progress.append(progress)
        courses.insert(
            0,
            {
                "id": 0,
                "slug": "english",
                "title": "Ingliz tili",
                "description": "Beginnerdan advancedgacha speaking, grammar va reading yo'li.",
                "theme": "english",
                "visual_type": "liquid_target",
                "target_label": "Level tanlang",
                "lesson_count": 5,
                "progress": max(english_progress) if english_progress else 0,
                "completed_challenges": 0,
                "total_challenges": 0,
            },
        )
        return courses

    async def _ordered_course_rows(self, course_id: int) -> list[aiosqlite.Row]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT c.id AS course_id, c.slug, c.title AS course_title, c.target_label,
                   u.id AS unit_id, u.title AS unit_title, u.unit_order,
                   l.id AS lesson_id, l.title AS lesson_title, l.lesson_order, l.intro_vocab_json, l.image_hint, l.audio_hint,
                   ch.id AS challenge_id, ch.challenge_type, ch.question, ch.prompt_text, ch.explanation, ch.challenge_order
            FROM learning_courses c
            JOIN learning_units u ON u.course_id = c.id
            JOIN learning_lessons l ON l.unit_id = u.id
            JOIN learning_challenges ch ON ch.lesson_id = l.id
            WHERE c.id = ?
            ORDER BY u.unit_order ASC, l.lesson_order ASC, ch.challenge_order ASC
            """,
            (course_id,),
        )
        return await cursor.fetchall()

    async def _resolve_learning_pointer(self, user_id: int, course_id: int) -> dict | None:
        assert self.connection is not None
        rows = await self._ordered_course_rows(course_id)
        if not rows:
            return None
        for row in rows:
            progress = await (
                await self.connection.execute(
                    """
                    SELECT completed
                    FROM learning_challenge_progress
                    WHERE user_id = ? AND challenge_id = ?
                    """,
                    (user_id, row["challenge_id"]),
                )
            ).fetchone()
            if not progress or int(progress["completed"]) == 0:
                return dict(row)
        return dict(rows[-1])

    async def select_learning_course(self, user_id: int, slug: str) -> dict | None:
        assert self.connection is not None
        course = await (
            await self.connection.execute(
                "SELECT id, slug, title FROM learning_courses WHERE slug = ?",
                (slug,),
            )
        ).fetchone()
        if not course:
            return None
        pointer = await self._resolve_learning_pointer(user_id, int(course["id"]))
        await self.connection.execute(
            """
            UPDATE learning_user_progress
            SET active_course_id = ?, active_unit_id = ?, active_lesson_id = ?, active_challenge_id = ?
            WHERE user_id = ?
            """,
            (
                int(course["id"]),
                pointer["unit_id"] if pointer else None,
                pointer["lesson_id"] if pointer else None,
                pointer["challenge_id"] if pointer else None,
                user_id,
            ),
        )
        await self.connection.commit()
        return {"course_id": int(course["id"]), "slug": course["slug"], "title": course["title"]}

    async def get_learning_current_state(self, user_id: int) -> dict:
        assert self.connection is not None
        profile = await self.ensure_learning_user_progress(user_id)
        active_course_id = profile.get("active_course_id")
        if not active_course_id:
            first = await self._first_learning_challenge()
            active_course_id = first["course_id"] if first else None
        if active_course_id:
            pointer = await self._resolve_learning_pointer(user_id, int(active_course_id))
            if pointer:
                await self.connection.execute(
                    """
                    UPDATE learning_user_progress
                    SET active_course_id = ?, active_unit_id = ?, active_lesson_id = ?, active_challenge_id = ?
                    WHERE user_id = ?
                    """,
                    (pointer["course_id"], pointer["unit_id"], pointer["lesson_id"], pointer["challenge_id"], user_id),
                )
                await self.connection.commit()
                profile = await self.ensure_learning_user_progress(user_id)
        return profile

    async def get_learning_lesson_bundle(self, user_id: int, lesson_id: int | None = None) -> dict | None:
        assert self.connection is not None
        progress = await self.get_learning_current_state(user_id)
        target_lesson_id = lesson_id or progress.get("active_lesson_id")
        if not target_lesson_id:
            return None
        lesson_row = await (
            await self.connection.execute(
                """
                SELECT l.id, l.title, l.lesson_order, l.intro_vocab_json, l.image_hint, l.audio_hint,
                       u.id AS unit_id, u.title AS unit_title, u.unit_order,
                       c.id AS course_id, c.slug, c.title AS course_title, c.target_label
                FROM learning_lessons l
                JOIN learning_units u ON u.id = l.unit_id
                JOIN learning_courses c ON c.id = u.course_id
                WHERE l.id = ?
                """,
                (target_lesson_id,),
            )
        ).fetchone()
        if not lesson_row:
            return None
        challenge_rows = await (
            await self.connection.execute(
                """
                SELECT id, challenge_type, question, prompt_text, explanation, challenge_order
                FROM learning_challenges
                WHERE lesson_id = ?
                ORDER BY challenge_order ASC
                """,
                (target_lesson_id,),
            )
        ).fetchall()
        challenges = []
        completed_count = 0
        current_challenge_id = progress.get("active_challenge_id")
        for challenge in challenge_rows:
            option_rows = await (
                await self.connection.execute(
                    """
                    SELECT id, option_text, is_correct, image_hint, audio_text
                    FROM learning_challenge_options
                    WHERE challenge_id = ?
                    ORDER BY id ASC
                    """,
                    (challenge["id"],),
                )
            ).fetchall()
            progress_row = await (
                await self.connection.execute(
                    """
                    SELECT selected_option_id, attempts, completed
                    FROM learning_challenge_progress
                    WHERE user_id = ? AND challenge_id = ?
                    """,
                    (user_id, challenge["id"]),
                )
            ).fetchone()
            is_done = bool(progress_row and int(progress_row["completed"]) == 1)
            if is_done:
                completed_count += 1
            challenges.append(
                {
                    "id": int(challenge["id"]),
                    "type": challenge["challenge_type"],
                    "question": challenge["question"],
                    "prompt_text": challenge["prompt_text"] or "",
                    "explanation": challenge["explanation"] or "",
                    "order": int(challenge["challenge_order"]),
                    "completed": is_done,
                    "attempts": int(progress_row["attempts"] or 0) if progress_row else 0,
                    "selected_option_id": int(progress_row["selected_option_id"]) if progress_row and progress_row["selected_option_id"] else None,
                    "is_current": int(challenge["id"]) == int(current_challenge_id or 0),
                    "options": [
                        {
                            "id": int(option["id"]),
                            "text": option["option_text"],
                            "image_hint": option["image_hint"] or "",
                            "audio_text": option["audio_text"] or option["option_text"],
                        }
                        for option in option_rows
                    ],
                }
            )
        return {
            "course": {
                "id": int(lesson_row["course_id"]),
                "slug": lesson_row["slug"],
                "title": lesson_row["course_title"],
                "target_label": lesson_row["target_label"],
            },
            "unit": {
                "id": int(lesson_row["unit_id"]),
                "title": lesson_row["unit_title"],
                "order": int(lesson_row["unit_order"]),
            },
            "lesson": {
                "id": int(lesson_row["id"]),
                "title": lesson_row["title"],
                "order": int(lesson_row["lesson_order"]),
                "image_hint": lesson_row["image_hint"] or "",
                "audio_hint": lesson_row["audio_hint"] or "",
                "intro_vocab": self._load_json(lesson_row["intro_vocab_json"], []),
                "completed_count": completed_count,
                "total_challenges": len(challenges),
                "percentage": round((completed_count / len(challenges)) * 100) if challenges else 0,
            },
            "challenges": challenges,
        }

    async def submit_learning_answer(self, user_id: int, challenge_id: int, option_id: int | None) -> dict:
        assert self.connection is not None
        challenge = await (
            await self.connection.execute(
                """
                SELECT ch.id, ch.lesson_id, ch.challenge_type, ch.explanation, ch.question,
                       l.unit_id, u.course_id
                FROM learning_challenges ch
                JOIN learning_lessons l ON l.id = ch.lesson_id
                JOIN learning_units u ON u.id = l.unit_id
                WHERE ch.id = ?
                """,
                (challenge_id,),
            )
        ).fetchone()
        if not challenge:
            raise ValueError("Challenge not found")

        correct_option = await (
            await self.connection.execute(
                """
                SELECT id, option_text
                FROM learning_challenge_options
                WHERE challenge_id = ? AND is_correct = 1
                LIMIT 1
                """,
                (challenge_id,),
            )
        ).fetchone()
        if not correct_option:
            raise ValueError("Correct option not found")

        is_correct = int(option_id or 0) == int(correct_option["id"])
        progress_row = await (
            await self.connection.execute(
                "SELECT id, attempts, completed FROM learning_challenge_progress WHERE user_id = ? AND challenge_id = ?",
                (user_id, challenge_id),
            )
        ).fetchone()
        attempts = int(progress_row["attempts"] or 0) + 1 if progress_row else 1
        now = self._now_iso()

        if progress_row:
            await self.connection.execute(
                """
                UPDATE learning_challenge_progress
                SET selected_option_id = ?, attempts = ?, completed = ?, completed_at = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    option_id,
                    attempts,
                    1 if is_correct else int(progress_row["completed"] or 0),
                    now if is_correct else progress_row["completed_at"] if "completed_at" in progress_row.keys() else None,
                    now,
                    progress_row["id"],
                ),
            )
        else:
            await self.connection.execute(
                """
                INSERT INTO learning_challenge_progress (
                    user_id, challenge_id, selected_option_id, attempts, completed, completed_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (user_id, challenge_id, option_id, attempts, 1 if is_correct else 0, now if is_correct else None, now),
            )

        progress = await self.ensure_learning_user_progress(user_id)
        xp_delta = 0
        energy_delta = 0
        if is_correct:
            xp_delta = 12 if challenge["challenge_type"] in {"LISTENING", "SPEAKING"} else 10
            await self.connection.execute(
                """
                UPDATE learning_user_progress
                SET xp = xp + ?, energy = MIN(5, energy + 1)
                WHERE user_id = ?
                """,
                (xp_delta, user_id),
            )
            activity_type = challenge["challenge_type"].lower()
            minutes = 2 if activity_type in {"listening", "speaking"} else 1
            await self.connection.execute(
                """
                INSERT INTO learning_activity_log (user_id, activity_type, minutes, xp_delta, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (user_id, activity_type, minutes, xp_delta, now),
            )
        else:
            energy_delta = -1
            await self.connection.execute(
                """
                UPDATE learning_user_progress
                SET energy = MAX(0, energy - 1)
                WHERE user_id = ?
                """,
                (user_id,),
            )

        lesson_completion_cursor = await self.connection.execute(
            """
            SELECT COUNT(*) AS done
            FROM learning_challenge_progress p
            JOIN learning_challenges ch ON ch.id = p.challenge_id
            WHERE p.user_id = ? AND ch.lesson_id = ? AND p.completed = 1
            """,
            (user_id, challenge["lesson_id"]),
        )
        lesson_done = await lesson_completion_cursor.fetchone()
        lesson_total = await (
            await self.connection.execute(
                "SELECT COUNT(*) AS total FROM learning_challenges WHERE lesson_id = ?",
                (challenge["lesson_id"],),
            )
        ).fetchone()
        lesson_just_completed = bool(lesson_done and lesson_total and int(lesson_done["done"]) == int(lesson_total["total"]))
        if lesson_just_completed:
            await self.connection.execute(
                """
                INSERT OR IGNORE INTO learning_lesson_completions (user_id, lesson_id, completed_at)
                VALUES (?, ?, ?)
                """,
                (user_id, challenge["lesson_id"], date.today().isoformat()),
            )
            await self._update_streak(user_id, date.today().isoformat())

        pointer = await self._resolve_learning_pointer(user_id, int(challenge["course_id"]))
        if pointer:
            await self.connection.execute(
                """
                UPDATE learning_user_progress
                SET active_course_id = ?, active_unit_id = ?, active_lesson_id = ?, active_challenge_id = ?
                WHERE user_id = ?
                """,
                (pointer["course_id"], pointer["unit_id"], pointer["lesson_id"], pointer["challenge_id"], user_id),
            )
        await self.connection.commit()

        updated_profile = await self.ensure_learning_user_progress(user_id)
        return {
            "correct": is_correct,
            "correct_option_id": int(correct_option["id"]),
            "correct_option_text": correct_option["option_text"],
            "explanation": challenge["explanation"] or "",
            "xp": int(updated_profile["xp"] or 0),
            "energy": int(updated_profile["energy"] or 0),
            "xp_delta": xp_delta,
            "energy_delta": energy_delta,
            "lesson_completed": lesson_just_completed,
            "streak": await self.get_streak_count(user_id),
        }

    async def get_weekly_learning_stats(self, user_id: int) -> dict:
        assert self.connection is not None
        since = (datetime.utcnow() - timedelta(days=7)).isoformat(timespec="seconds")
        cursor = await self.connection.execute(
            """
            SELECT activity_type, COALESCE(SUM(minutes), 0) AS minutes, COALESCE(SUM(xp_delta), 0) AS xp
            FROM learning_activity_log
            WHERE user_id = ? AND created_at >= ?
            GROUP BY activity_type
            """,
            (user_id, since),
        )
        rows = await cursor.fetchall()
        speaking = sum(int(row["minutes"]) for row in rows if row["activity_type"] == "speaking")
        listening = sum(int(row["minutes"]) for row in rows if row["activity_type"] == "listening")
        total_xp = sum(int(row["xp"]) for row in rows)
        return {
            "speaking_minutes": speaking,
            "listening_minutes": listening,
            "weekly_xp": total_xp,
        }

    async def get_learning_leaderboard(self) -> list[dict]:
        assert self.connection is not None
        since = (datetime.utcnow() - timedelta(days=7)).isoformat(timespec="seconds")
        cursor = await self.connection.execute(
            """
            SELECT u.user_id, us.full_name,
                   COALESCE(SUM(a.xp_delta), 0) AS weekly_xp
            FROM learning_user_progress u
            JOIN users us ON us.user_id = u.user_id
            LEFT JOIN learning_activity_log a ON a.user_id = u.user_id AND a.created_at >= ?
            GROUP BY u.user_id, us.full_name
            ORDER BY weekly_xp DESC, us.full_name ASC
            LIMIT 20
            """,
            (since,),
        )
        rows = await cursor.fetchall()
        return [
            {
                "rank": index,
                "user_id": int(row["user_id"]),
                "name": row["full_name"],
                "weekly_xp": int(row["weekly_xp"] or 0),
                "verified": index <= 3,
            }
            for index, row in enumerate(rows, start=1)
        ]

    async def get_learning_achievements(self, user_id: int) -> list[dict]:
        stats = await self.get_weekly_learning_stats(user_id)
        completed_lessons_cursor = await self.connection.execute(
            "SELECT COUNT(*) AS total FROM learning_lesson_completions WHERE user_id = ?",
            (user_id,),
        )
        completed_lessons_row = await completed_lessons_cursor.fetchone()
        completed_lessons = int(completed_lessons_row["total"] or 0) if completed_lessons_row else 0
        profile = await self.ensure_learning_user_progress(user_id)
        xp = int(profile.get("xp") or 0)
        streak = await self.get_streak_count(user_id)
        latest_band = await self.get_latest_overall_band(user_id)
        return [
            {
                "id": "first_lesson",
                "title": "Birinchi dars",
                "description": "Kamida 1 dars yakunlandi.",
                "unlocked": completed_lessons >= 1,
            },
            {
                "id": "lesson_three",
                "title": "3 dars yakunlandi",
                "description": "3 ta darsni muvaffaqiyatli tugating.",
                "unlocked": completed_lessons >= 3,
            },
            {
                "id": "xp_100",
                "title": "100 XP",
                "description": "100 XP to'plang.",
                "unlocked": xp >= 100,
            },
            {
                "id": "streak_7",
                "title": "7 kunlik streak",
                "description": "7 kun ketma-ket o'rganing.",
                "unlocked": streak >= 7,
            },
            {
                "id": "listening_30",
                "title": "Listening 30 daqiqa",
                "description": "Bir haftada 30 daqiqa listening qiling.",
                "unlocked": stats["listening_minutes"] >= 30,
            },
            {
                "id": "ielts_7",
                "title": "IELTS 7+",
                "description": "7.0 yoki undan yuqori natija oling.",
                "unlocked": latest_band >= 7.0,
            },
        ]

    async def get_learning_lesson_map(self, user_id: int, course_id: int | None = None) -> list[dict]:
        assert self.connection is not None
        progress = await self.get_learning_current_state(user_id)
        target_course_id = int(course_id or progress.get("active_course_id") or 0)
        if not target_course_id:
          return []
        units_cursor = await self.connection.execute(
            """
            SELECT id, title, description, unit_order
            FROM learning_units
            WHERE course_id = ?
            ORDER BY unit_order ASC
            """,
            (target_course_id,),
        )
        units = []
        for unit in await units_cursor.fetchall():
            lessons_cursor = await self.connection.execute(
                """
                SELECT id, title, lesson_order
                FROM learning_lessons
                WHERE unit_id = ?
                ORDER BY lesson_order ASC
                """,
                (unit["id"],),
            )
            lessons = []
            for lesson in await lessons_cursor.fetchall():
                total_cursor = await self.connection.execute(
                    "SELECT COUNT(*) AS total FROM learning_challenges WHERE lesson_id = ?",
                    (lesson["id"],),
                )
                done_cursor = await self.connection.execute(
                    """
                    SELECT COUNT(*) AS total
                    FROM learning_challenge_progress p
                    JOIN learning_challenges ch ON ch.id = p.challenge_id
                    WHERE p.user_id = ? AND p.completed = 1 AND ch.lesson_id = ?
                    """,
                    (user_id, lesson["id"]),
                )
                total_row = await total_cursor.fetchone()
                done_row = await done_cursor.fetchone()
                total = int(total_row["total"] or 0) if total_row else 0
                done = int(done_row["total"] or 0) if done_row else 0
                percentage = round((done / total) * 100) if total else 0
                status = "done" if total and done >= total else "current" if int(progress.get("active_lesson_id") or 0) == int(lesson["id"]) else "locked" if done == 0 and int(progress.get("active_lesson_id") or 0) != int(lesson["id"]) else "partial"
                lessons.append(
                    {
                        "id": int(lesson["id"]),
                        "title": lesson["title"],
                        "order": int(lesson["lesson_order"]),
                        "percentage": percentage,
                        "status": status,
                    }
                )
            units.append(
                {
                    "id": int(unit["id"]),
                    "title": unit["title"],
                    "description": unit["description"],
                    "order": int(unit["unit_order"]),
                    "lessons": lessons,
                }
            )
        return units

    async def get_review_challenges(self, user_id: int, limit: int = 10) -> list[dict]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT ch.id, ch.question, ch.prompt_text, ch.explanation, ch.challenge_type,
                   l.title AS lesson_title
            FROM learning_challenge_progress p
            JOIN learning_challenges ch ON ch.id = p.challenge_id
            JOIN learning_lessons l ON l.id = ch.lesson_id
            WHERE p.user_id = ? AND p.completed = 0 AND p.attempts > 0
            ORDER BY p.updated_at DESC
            LIMIT ?
            """,
            (user_id, int(limit)),
        )
        rows = await cursor.fetchall()
        review_items = []
        for row in rows:
            options_cursor = await self.connection.execute(
                """
                SELECT id, option_text, image_hint, audio_text
                FROM learning_challenge_options
                WHERE challenge_id = ?
                ORDER BY id ASC
                """,
                (row["id"],),
            )
            review_items.append(
                {
                    "id": int(row["id"]),
                    "type": row["challenge_type"],
                    "question": row["question"],
                    "prompt_text": row["prompt_text"] or "",
                    "explanation": row["explanation"] or "",
                    "lesson_title": row["lesson_title"],
                    "options": [
                        {
                            "id": int(option["id"]),
                            "text": option["option_text"],
                            "image_hint": option["image_hint"] or "",
                            "audio_text": option["audio_text"] or option["option_text"],
                        }
                        for option in await options_cursor.fetchall()
                    ],
                }
            )
        return review_items

    async def get_daily_quests(self, user_id: int) -> list[dict]:
        stats = await self.get_weekly_learning_stats(user_id)
        bundle = await self.get_learning_lesson_bundle(user_id)
        current_progress = int(bundle["lesson"]["completed_count"]) if bundle else 0
        completed_lessons_cursor = await self.connection.execute(
            "SELECT COUNT(*) AS total FROM learning_lesson_completions WHERE user_id = ? AND completed_at = ?",
            (user_id, date.today().isoformat()),
        )
        today_done_row = await completed_lessons_cursor.fetchone()
        today_done = int(today_done_row["total"] or 0) if today_done_row else 0
        return [
            {
                "id": "lesson_finish",
                "title": "Bugungi lessonni yopish",
                "current": min(1, today_done),
                "target": 1,
                "reward_xp": 20,
            },
            {
                "id": "challenge_three",
                "title": "3 ta challenge yechish",
                "current": min(3, current_progress),
                "target": 3,
                "reward_xp": 15,
            },
            {
                "id": "speaking_five",
                "title": "5 daqiqa speaking",
                "current": min(5, stats["speaking_minutes"]),
                "target": 5,
                "reward_xp": 15,
            },
        ]

    async def create_custom_scenario(self, user_id: int, *, title: str, description: str, goal: str, tasks: list[str], difficulty: str) -> dict:
        assert self.connection is not None
        created_at = self._now_iso()
        await self.connection.execute(
            """
            INSERT INTO learning_custom_scenarios (user_id, title, description, goal, tasks_json, difficulty, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, title, description, goal, json.dumps(tasks, ensure_ascii=False), difficulty, created_at),
        )
        await self.connection.commit()
        row = await (
            await self.connection.execute(
                """
                SELECT id, title, description, goal, tasks_json, difficulty, created_at
                FROM learning_custom_scenarios
                WHERE user_id = ?
                ORDER BY id DESC
                LIMIT 1
                """,
                (user_id,),
            )
        ).fetchone()
        assert row is not None
        return {
            "id": int(row["id"]),
            "title": row["title"],
            "description": row["description"],
            "goal": row["goal"],
            "tasks": self._load_json(row["tasks_json"], []),
            "difficulty": row["difficulty"],
            "created_at": row["created_at"],
        }

    async def list_custom_scenarios(self, user_id: int, limit: int = 8) -> list[dict]:
        assert self.connection is not None
        cursor = await self.connection.execute(
            """
            SELECT id, title, description, goal, tasks_json, difficulty, created_at
            FROM learning_custom_scenarios
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT ?
            """,
            (user_id, int(limit)),
        )
        rows = await cursor.fetchall()
        return [
            {
                "id": int(row["id"]),
                "title": row["title"],
                "description": row["description"],
                "goal": row["goal"],
                "tasks": self._load_json(row["tasks_json"], []),
                "difficulty": row["difficulty"],
                "created_at": row["created_at"],
            }
            for row in rows
        ]
