from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://board_user:board_password@localhost:5432/board_db"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env")

settings = Settings()