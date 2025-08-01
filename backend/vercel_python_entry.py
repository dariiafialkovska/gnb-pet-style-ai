# backend/vercel_python_entry.py
from fastapi import FastAPI
from backend.main import app as fastapi_app
# This is the entry point for Vercel to run the FastAPI application
app = fastapi_app
