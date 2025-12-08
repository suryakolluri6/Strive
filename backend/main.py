from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_to_mongo, close_mongo_connection
from config import settings
from pydantic import BaseModel
from typing import List
from datetime import datetime
from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os



# Lifespan context manager for startup/shutdown events (async)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    try:
        yield
    finally:
        await close_mongo_connection()

load_dotenv()
MONGO_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
app = FastAPI(
    title="Strive API",
    description="Backend API for Strive",
    version="0.1.0",
    lifespan=lifespan,
)
client = AsyncMongoClient(MONGO_URL)
db = client[DATABASE_NAME]
stats_collection = db.get_collection("stats")


# Enable CORS for frontend communication
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Exercise(BaseModel):
    id: str
    bodyPart: str
    exercise: str
    sets: int
    reps: int
    weight: float

class StatsSubmission(BaseModel):
    sessionTime: int
    exercises: List[Exercise]
    totalWeight: float
    timestamp: datetime


@app.post("/stats")
async def submit_stats(data: StatsSubmission):
    submission = data.model_dump()
    submission["created_at"] = datetime.now()
    await stats_collection.insert_one(submission)
    return {"message": "Workout saved successfully!"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Strive API"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
