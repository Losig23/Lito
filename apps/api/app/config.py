from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENV: str = "dev"
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",          # read .env if present
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
