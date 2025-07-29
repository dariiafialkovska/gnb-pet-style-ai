# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from convert_to_png import convert_to_png
from openai import OpenAI
from io import BytesIO
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        # Convert to PNG if not already
        if not file.filename.lower().endswith(".png"):
            image_bytes = convert_to_png(image_bytes)

        image_file = BytesIO(image_bytes)
        image_file.name = "dog.png"  # Required for OpenAI client

        response = client.images.edit(
            model="gpt-image-1",
            image=image_file,
            prompt="The same dog wearing a cozy GNB-branded hoodie, photorealistic, soft lighting, studio background",
            size="1024x1024",
            response_format="b64_json"
        )

        img_b64 = response.data[0].b64_json
        return {"b64_json": img_b64}

    except Exception as e:
        print("❌ Error:", e)
        return {"error": str(e)}
