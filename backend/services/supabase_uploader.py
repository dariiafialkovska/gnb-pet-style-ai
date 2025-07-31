# backend/services/supabase_uploader.py

from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")  # ✅ handles path properly

import os
from supabase import create_client, Client
from uuid import uuid4

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")

if not SUPABASE_URL or not SUPABASE_API_KEY:
    raise RuntimeError("❌ Missing SUPABASE_URL or SUPABASE_API_KEY in environment.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

def upload_image_to_supabase(image_bytes: bytes, extension="png") -> str:
    filename = f"{uuid4().hex}.{extension}"
    filepath = filename
    print(f"📦 Uploading image to Supabase: {filepath}")

    response = supabase.storage.from_("dog-ai-images").upload(
        path=filepath,
        file=image_bytes,
        file_options={"content-type": f"image/{extension}"}
    )

    print(f"📨 Upload response: {response}")

    if hasattr(response, "error") and response.error is not None:
        raise Exception(f"❌ Upload failed: {response.error}")

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/dog-ai-images/{filename}"
    print(f"✅ Image uploaded successfully: {public_url}")
    return public_url
