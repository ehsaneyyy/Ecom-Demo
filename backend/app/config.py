from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiry_minutes: int = 1440
    admin_secret_key: str = "ATELIER-ADMIN-2026"

    model_config = {"env_file": ".env"}

    @property
    def async_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        for param in ("sslmode=require", "channel_binding=require", "&channel_binding=require"):
            url = url.replace(param, "")
        url = url.rstrip("?&")
        return url


settings = Settings()
