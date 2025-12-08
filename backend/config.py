import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings"""
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")

settings = Settings()
