from supabase import create_client, Client
from uuid import uuid4
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

def upload_image_to_supabase(image_bytes: bytes, extension="png") -> str:
    filename = f"{uuid4().hex}.{extension}"
    filepath = f"dog-ai-images/{filename}"

    response = supabase.storage.from_("dog-ai-images").upload(
        path=filepath,
        file=image_bytes,
        file_options={"content-type": f"image/{extension}"}
    )

    # ✅ This is the proper check for Supabase v2
    if not response.data:
        raise Exception(f"Upload failed: {response}")

    return f"{SUPABASE_URL}/storage/v1/object/public/dog-ai-images/{filename}"
