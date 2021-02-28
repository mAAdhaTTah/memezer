from typing import Any, Dict, Optional

from pydantic import AnyHttpUrl, BaseSettings, DirectoryPath, PostgresDsn, validator


class Settings(BaseSettings):
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    JWT_ALGORITHM: Optional[str] = "HS256"
    JWT_SECRET_KEY: str

    MEDIA_PATH: DirectoryPath

    ENABLE_CORS: bool = False

    DOMAIN: str = "localhost:8080"
    SSL: bool = False
    MEDIA_SUBPATH: str = "media"
    MEDIA_URL: Optional[AnyHttpUrl] = None

    @validator("MEDIA_URL", pre=True)
    def default_media_ur(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        protocol = "https" if values["SSL"] else "http"
        return f"{protocol}://{values['DOMAIN']}/{values['MEDIA_SUBPATH']}"

    class Config:
        case_sensitive = True


settings = Settings()
