from supabase import create_client, Client
from uuid import uuid4
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

def upload_image_to_supabase(image_bytes: bytes, extension="png") -> str:
    filename = f"{uuid4().hex}.{extension}"
    filepath = filename
    print(f"Uploading image to Supabase: {filepath}")

    response = supabase.storage.from_("dog-ai-images").upload(
        path=filepath,
        file=image_bytes,
        file_options={"content-type": f"image/{extension}"}
    )

    print(f"Upload response: {response}")

    if hasattr(response, "error") and response.error is not None:
        raise Exception(f"Upload failed: {response.error}")

    print(f"Image uploaded successfully: {filename}")
    return f"{SUPABASE_URL}/storage/v1/object/public/dog-ai-images/{filename}"
