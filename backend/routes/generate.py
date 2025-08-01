# routes/generate.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from io import BytesIO
import base64
import os
from openai import OpenAI
from ..services.convert_to_png import convert_to_png
from ..services.supabase_uploader import upload_image_to_supabase
from ..services.logo_overlay import overlay_gnb_logo
from ..utils.prompts import build_prompt
from ..services.optimize_images import optimize_input_image
import time
import requests

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PROMPT_BASE = "Same dog in a dark brown sweater with a green GNB patch, resting on a plush couch with soft pillows and warm wood textures under ambient light"

@router.post("/generate")
async def generate(
    file: UploadFile = File(...),
    scenario: str = Form(None),
    clothing: str = Form(None)
):
    total_start = time.time()
    print("📥 Received file:", file.filename)
    print("🎨 Scenario:", scenario, "| Clothing:", clothing)

    try:
        # File reading timing
        read_start = time.time()
        image_bytes = await file.read()
        read_time = time.time() - read_start
        print(f"⏱️ File read time: {read_time:.3f}s")

        # PNG conversion timing (if needed)
        convert_start = time.time()
        if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
            image_bytes = convert_to_png(image_bytes)
        convert_time = time.time() - convert_start
        if convert_time > 0.001:  # Only log if significant
            print(f"⏱️ PNG conversion time: {convert_time:.3f}s")

        # 🚀 OPTIMIZE IMAGE FOR SPEED
        optimized_image, compression_stats = optimize_input_image(
            image_bytes, 
            max_size=512,  # Smaller = faster (use 256 for even more speed)
            quality=85     # Balance between quality and speed
        )
        
        # Set the filename for OpenAI
        optimized_image.name = "dog.jpg"  # Use .jpg since we're optimizing as JPEG

        # Build prompt timing
        prompt_start = time.time()
        prompt = build_prompt(scenario, clothing)
        prompt_time = time.time() - prompt_start
        print("🧠 Final prompt:", prompt)
        print(f"⏱️ Prompt build time: {prompt_time:.3f}s")

        # 🎯 OpenAI API call timing
        print("🚀 Starting OpenAI API call...")
        openai_start = time.time()
        
        response = client.images.edit(
            model="gpt-image-1",
            image=optimized_image,
            prompt=prompt,
            size="1024x1024",        # 🚀 Smaller size = faster processing
            quality="low",         # Keep low for speed
            output_format="jpeg",
            output_compression=80  # Good balance
        )
        
        openai_time = time.time() - openai_start
        print(f"⏱️ OpenAI API time: {openai_time:.3f}s")

        # Image processing timing
        process_start = time.time()
        img_b64 = response.data[0].b64_json
        decoded_image = base64.b64decode(img_b64)
        process_time = time.time() - process_start
        print(f"⏱️ Image decode time: {process_time:.3f}s")

        # Logo overlay timing
        overlay_start = time.time()
        logo_overlayed_image = overlay_gnb_logo(decoded_image)
        overlay_time = time.time() - overlay_start
        print(f"⏱️ Logo overlay time: {overlay_time:.3f}s")

        # Upload timing
        upload_start = time.time()
        image_url = upload_image_to_supabase(logo_overlayed_image.getvalue())
        upload_time = time.time() - upload_start
        print(f"⏱️ Upload time: {upload_time:.3f}s")

        # Total timing summary
        total_time = time.time() - total_start
        
        print("\n" + "="*50)
        print("📊 PERFORMANCE SUMMARY")
        print("="*50)
        print(f"📁 File read:        {read_time:.3f}s")
        print(f"🔄 PNG conversion:   {convert_time:.3f}s") 
        print(f"🗜️  Image compression: {compression_stats['compression_time']:.3f}s")
        print(f"   └─ Size reduction: {compression_stats['compression_ratio']:.1f}%")
        print(f"   └─ {compression_stats['original_size']:,} → {compression_stats['compressed_size']:,} bytes")
        print(f"🧠 Prompt build:     {prompt_time:.3f}s")
        print(f"🤖 OpenAI API:       {openai_time:.3f}s  ⭐ MAIN BOTTLENECK")
        print(f"🖼️  Image decode:     {process_time:.3f}s")
        print(f"🎨 Logo overlay:     {overlay_time:.3f}s")
        print(f"☁️  Upload:           {upload_time:.3f}s")
        print(f"⏱️  TOTAL TIME:       {total_time:.3f}s")
        
        # Performance insights
        if openai_time > 3:
            print("💡 OpenAI is slow - try smaller image size or simpler prompt")
        if compression_stats['compression_time'] > 0.5:
            print("💡 Compression is slow - reduce max_size or quality")
        if upload_time > 1:
            print("💡 Upload is slow - check network/Supabase performance")
            
        print("="*50)

        return {
            "image_url": image_url,
            "performance": {
                "total_time": round(total_time, 3),
                "openai_time": round(openai_time, 3),
                "compression_time": round(compression_stats['compression_time'], 3),
                "compression_ratio": round(compression_stats['compression_ratio'], 1),
                "upload_time": round(upload_time, 3)
            }
        }

    except Exception as e:
        total_time = time.time() - total_start
        print(f"❌ OpenAI Error after {total_time:.3f}s:", e)
        return {"error": str(e), "total_time": round(total_time, 3)}

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


FLUX_API_URL = "https://api.aimlapi.com/v1/images/generations"
FLUX_API_KEY = os.getenv("FLUX_API_KEY")

@router.post("/generate-flux")
async def generate_flux(
    file: UploadFile = File(...),
    scenario: str = Form(None),
    clothing: str = Form(None)
):
    total_start = time.time()
    print("📥 Flux file received:", file.filename)
    print("🎨 Scenario:", scenario, "| Clothing:", clothing)

    try:
        # Read image bytes
        image_bytes = await file.read()

        # Upload to Supabase temporarily to get a public image URL for Flux
        temp_image_url = upload_image_to_supabase(image_bytes)
        print("☁️ Uploaded temp image for Flux:", temp_image_url)

        # Build prompt
        prompt = build_prompt(scenario, clothing)
        print("🧠 Flux prompt:", prompt)

        # Call Flux API
        start_flux = time.time()
        response = requests.post(
            FLUX_API_URL,
            headers={
                "Authorization": f"Bearer {FLUX_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "image_url": temp_image_url,
                "prompt": prompt,
                "model": "flux/kontext-max/image-to-image",
            },
            timeout=60
        )
        flux_time = time.time() - start_flux
        print(f"⚡ Flux API time: {flux_time:.2f}s")

        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()
        if "data" not in data or not data["data"]:
            raise HTTPException(status_code=500, detail="Flux returned no image.")

        generated_image_url = data["data"][0]["url"]

        # Download the generated image
        img_response = requests.get(generated_image_url)
        img_response.raise_for_status()

        # Upload Flux result to Supabase
        final_url = upload_image_to_supabase(img_response.content)
        total_time = time.time() - total_start

        print("✅ Flux generation complete:", final_url)
        print(f"⏱️ Total Flux route time: {total_time:.2f}s")

        return {
            "image_url": final_url,
            "performance": {
                "total_time": round(total_time, 2),
                "flux_api_time": round(flux_time, 2)
            }
        }

    except Exception as e:
        total_time = time.time() - total_start
        print(f"❌ Flux Error after {total_time:.2f}s:", e)
        raise HTTPException(status_code=500, detail=str(e))