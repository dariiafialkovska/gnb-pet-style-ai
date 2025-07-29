# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from convert_to_png import convert_to_png
from openai import OpenAI
from io import BytesIO
import os
import base64
from google.cloud import aiplatform
from google.cloud import aiplatform_v1
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
            size="1024x1024"
        )


        img_b64 = response.data[0].b64_json
        return {"b64_json": img_b64}

    except Exception as e:
        print("❌ Error:", e)
        return {"error": str(e)}

@app.on_event("startup")
def startup_event():
    aiplatform.init(
        project=os.getenv("VERTEX_PROJECT_ID"),
        location="us-central1",
    )


@app.post("/generate-imagen")
async def generate_imagen(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        if not file.filename.lower().endswith(".png"):
            image_bytes = convert_to_png(image_bytes)

        # Convert image to base64 for editing
        import base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')

        prompt = "The same dog wearing a cozy GNB-branded hoodie, photorealistic, soft lighting, studio background"

        prediction_client = aiplatform_v1.PredictionServiceClient()
        endpoint = (
            f"projects/{os.getenv('VERTEX_PROJECT_ID')}/locations/us-central1/publishers/google/models/imagen-3.0-generate-002"
        )

        # Include the input image for editing
        instances = [{
            "prompt": prompt,
            "image": {
                "bytesBase64Encoded": image_b64
            }
        }]
        
        # Updated parameters for image editing
        parameters = {
            "sampleCount": 1,
            "aspectRatio": "1:1",  # Use aspectRatio instead of resolution for newer models
            "guidanceScale": 12,   # Controls how closely to follow the prompt
            "seed": 42            # For reproducible results
        }

        response = prediction_client.predict(
            endpoint=endpoint,
            instances=instances,
            parameters=parameters,
        )

        prediction = response.predictions[0]
        image_b64 = prediction["bytesBase64Encoded"]

        return {"b64_json": image_b64}

    except Exception as e:
        print("❌ Imagen Error:", e)
        return {"error": str(e)}


@app.post("/generate-dalle")
async def generate_dalle():
    try:
        prompt = "A dog wearing a cozy GNB-branded hoodie, photorealistic, soft lighting, studio background"

        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="standard",
            response_format="b64_json"
        )

        img_b64 = response.data[0].b64_json
        return {"b64_json": img_b64}

    except Exception as e:
        print("❌ DALL·E Error:", e)
        return {"error": str(e)}
