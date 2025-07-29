# backend/vercel_python_entry.py
from fastapi import FastAPI
from backend.main import app as fastapi_app

app = fastapi_app
