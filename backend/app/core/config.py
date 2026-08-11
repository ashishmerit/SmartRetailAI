from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    PROJECT_NAME: str = "Smart Retail AI API"

    PROJECT_VERSION: str = "1.0.0"

    DATABASE_URL: str

    GEMINI_API_KEY: str

    SECRET_KEY: str

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()