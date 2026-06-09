from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    postgres_user: str = "board_user"
    postgres_password: str = "board_password"
    postgres_db: str = "board_db"
    postgres_port: int = 5432
    database_url: str = (
        "postgresql+psycopg://board_user:board_password@localhost:5432/board_db"
    )

    # 실제 배포시 수정 필요
    jwt_secret_key: str = "secret-key"
    jwt_algorithm: str = "H256"
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env")


settings = Settings()
