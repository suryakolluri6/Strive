import os
from pathlib import Path

# Lightweight .env loader so we don't require python-dotenv as a dependency.
def _load_dotenv_file(path: str = ".env"):
    p = Path(path)
    if not p.exists():
        return
    for line in p.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, val = line.split("=", 1)
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        # don't overwrite existing environment variables
        if key not in os.environ:
            os.environ[key] = val


_load_dotenv_file()

class Settings:
    """Application settings"""
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "strive_db")
    
    class Config:
        env_file = ".env"

settings = Settings()
