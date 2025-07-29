# backend/main.py
from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv
import openai, os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

@app.post("/generate")
async def generate(file: UploadFile = File(...)):
    image_bytes = await file.read()
    response = openai.Image.create_variation(
        image=image_bytes,
        n=1,
        size="512x512"
    )
    return {"url": response['data'][0]['url']}
