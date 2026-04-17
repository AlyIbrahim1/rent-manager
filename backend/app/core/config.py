from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite+pysqlite:///./app.db"
    supabase_url: str = ""
    supabase_jwt_secret: str  # required — no default to prevent silent misconfiguration
    supabase_service_role_key: str = ""
    supabase_storage_bucket: str = "receipts"
    cors_origins: str = "http://localhost:5173"
    seed_enabled: bool = False


settings = Settings()
