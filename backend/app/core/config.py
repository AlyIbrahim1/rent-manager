from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite+pysqlite:///./app.db"
    supabase_url: str = ""
    supabase_jwt_secret: str = ""
    supabase_storage_bucket: str = "receipts"


settings = Settings()
