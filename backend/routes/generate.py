# routes/generate.py
from fastapi import APIRouter, UploadFile, File, Form
from io import BytesIO
import base64
import os
from openai import OpenAI
from ..services.convert_to_png import convert_to_png
from ..services.supabase_uploader import upload_image_to_supabase
from ..services.logo_overlay import overlay_gnb_logo
from ..utils.prompts import build_prompt

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PROMPT_BASE = "Same dog in a dark brown sweater with a green GNB patch, resting on a plush couch with soft pillows and warm wood textures under ambient light"

@router.post("/generate")
async def generate(
    file: UploadFile = File(...),
    scenario: str = Form(None),
    clothing: str = Form(None)
):
    print("📥 Received file:", file.filename)
    print("🎨 Scenario:", scenario, "| Clothing:", clothing)

    try:
        image_bytes = await file.read()

        if not file.filename.lower().endswith(".png"):
            image_bytes = convert_to_png(image_bytes)

        image_file = BytesIO(image_bytes)
        image_file.name = "dog.png"

        prompt = build_prompt(scenario, clothing)
        print("🧠 Final prompt:", prompt)

        response = client.images.edit(
            model="gpt-image-1",
            image=image_file,
            prompt=prompt,
            size="1024x1024",
            quality="low"
        )

        img_b64 = response.data[0].b64_json
        decoded_image = base64.b64decode(img_b64)

        logo_overlayed_image = overlay_gnb_logo(decoded_image)
        image_url = upload_image_to_supabase(logo_overlayed_image.getvalue())

        return {"image_url": image_url}

    except Exception as e:
        print("❌ OpenAI Error:", e)
        return {"error": str(e)}


@router.post("/generate-dalle")
async def generate_dalle():
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=PROMPT_BASE,
            n=1,
            size="1024x1024",
            quality="standard",
            response_format="b64_json"
        )

        img_b64 = response.data[0].b64_json
        image_bytes = base64.b64decode(img_b64)
        image_url = upload_image_to_supabase(image_bytes)

        return {"url": image_url}

    except Exception as e:
        print("❌ DALL·E Error:", e)
        return {"error": str(e)}


@router.post("/generate-imagen")
async def generate_imagen(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        if not file.filename.lower().endswith(".png"):
            image_bytes = convert_to_png(image_bytes)

        image_b64 = base64.b64encode(image_bytes).decode("utf-8")
        prediction_client = aiplatform_v1.PredictionServiceClient()

        endpoint = (
            f"projects/{os.getenv('VERTEX_PROJECT_ID')}/locations/us-central1/publishers/google/models/imagen-3.0-generate-002"
        )

        instances = [{
            "prompt": PROMPT_BASE,
            "image": {
                "bytesBase64Encoded": image_b64
            }
        }]

        parameters = {
            "sampleCount": 1,
            "aspectRatio": "1:1",
            "guidanceScale": 12,
            "seed": 42
        }

        response = prediction_client.predict(
            endpoint=endpoint,
            instances=instances,
            parameters=parameters,
        )

        prediction = response.predictions[0]
        img_b64 = prediction["bytesBase64Encoded"]
        image_bytes = base64.b64decode(img_b64)
        image_url = upload_image_to_supabase(image_bytes)

        return {"url": image_url}

    except Exception as e:
        print("❌ Imagen Error:", e)
        return {"error": str(e)}