from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite+pysqlite:///./app.db"
    supabase_url: str = ""
    supabase_jwt_secret: str  # required — no default to prevent silent misconfiguration
    supabase_jwt_audience: str = "authenticated"
    supabase_service_role_key: str = ""
    supabase_storage_bucket: str = "receipts"
    cors_origins: str = "http://localhost:5173"
    seed_enabled: bool = False
    dev_seed_tenant_id: str = "00000000-0000-0000-0000-000000000001"
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 120
    rate_limit_window_seconds: int = 60


settings = Settings()
