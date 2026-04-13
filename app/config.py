from dataclasses import dataclass
import os

from dotenv import load_dotenv


load_dotenv()


@dataclass(slots=True)
class Config:
    bot_token: str
    database_path: str = "fynex.db"
    admin_id: int | None = None
    web_app_url: str | None = None
    web_app_host: str = "0.0.0.0"
    web_app_port: int = 8080


def load_config() -> Config:
    bot_token = os.getenv("BOT_TOKEN", "").strip()
    if not bot_token:
        raise ValueError("BOT_TOKEN topilmadi. .env fayl yarating yoki muhit o'zgaruvchisini belgilang.")
    admin_id_raw = os.getenv("ADMIN_ID", "").strip()
    admin_id = int(admin_id_raw) if admin_id_raw else None
    web_app_url = os.getenv("WEB_APP_URL", "").strip() or None
    web_app_host = os.getenv("WEB_APP_HOST", "0.0.0.0").strip()
    web_app_port = int(os.getenv("WEB_APP_PORT", "8080").strip())
    return Config(
        bot_token=bot_token,
        admin_id=admin_id,
        web_app_url=web_app_url,
        web_app_host=web_app_host,
        web_app_port=web_app_port,
    )
