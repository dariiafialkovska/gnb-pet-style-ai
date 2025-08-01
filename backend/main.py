# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
# Ensure environment variables are loaded
load_dotenv()
# Import routes
from .routes.generate import router as generate_router
# Create FastAPI app instance
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the generate route
app.include_router(generate_router, prefix="/api")
