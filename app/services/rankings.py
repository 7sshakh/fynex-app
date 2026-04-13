from __future__ import annotations

from datetime import datetime


DEFAULT_LOCATIONS = {
    "district": "Mirzo Ulugbek",
    "region": "Toshkent",
    "country": "Uzbekistan",
}

DEFAULT_BOTS = [
    ("Javohir R.", "Mirzo Ulugbek", "Toshkent", "Uzbekistan", 22, 0.6),
    ("Elena S.", "Mirzo Ulugbek", "Toshkent", "Uzbekistan", 28, 0.5),
    ("Kamron T.", "Mirzo Ulugbek", "Toshkent", "Uzbekistan", 34, 0.45),
    ("Sofia A.", "Yunusobod", "Toshkent", "Uzbekistan", 30, 0.5),
    ("Mansur H.", "Yakkasaroy", "Toshkent", "Uzbekistan", 26, 0.55),
    ("Nigina U.", "Chilonzor", "Toshkent", "Uzbekistan", 24, 0.52),
    ("Daniel K.", "Samarkand City", "Samarkand", "Uzbekistan", 27, 0.46),
    ("Aziza M.", "Samarkand City", "Samarkand", "Uzbekistan", 29, 0.44),
    ("Temur P.", "Buxoro", "Bukhara", "Uzbekistan", 25, 0.47),
    ("Maria V.", "Buxoro", "Bukhara", "Uzbekistan", 31, 0.43),
    ("Artem I.", "Almaty", "Almaty", "Kazakhstan", 33, 0.41),
    ("Madina Q.", "Astana", "Astana", "Kazakhstan", 29, 0.48),
    ("Ethan C.", "Brooklyn", "New York", "USA", 38, 0.35),
    ("Lina H.", "Berlin Mitte", "Berlin", "Germany", 36, 0.37),
    ("Noah D.", "Toronto", "Ontario", "Canada", 35, 0.38),
    ("Aya N.", "Shibuya", "Tokyo", "Japan", 34, 0.39),
]


def score_user(
    *,
    completed_lessons: int,
    streak_count: int,
    focus_minutes: int,
    strategy_success_rate: int = 0,
    latest_overall_band: float = 0.0,
) -> int:
    return int(
        (completed_lessons * 18)
        + (streak_count * 7)
        + (focus_minutes / 6)
        + (strategy_success_rate * 0.45)
        + (latest_overall_band * 18)
    )


def dynamic_bot_score(base_score: int, growth_rate: float, bot_score_bias: int = 0) -> int:
    day_of_year = int(datetime.utcnow().strftime("%j"))
    return max(8, int(round(base_score + (day_of_year * growth_rate / 5) + bot_score_bias)))
