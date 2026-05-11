from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite+aiosqlite:///./data/mason.db"
    allowed_origins: str = "http://localhost:3000"
    anthropic_api_key: str | None = None
    github_token: str | None = None
    turnstile_secret: str | None = None
    resend_api_key: str | None = None
    environment: str = "development"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()
