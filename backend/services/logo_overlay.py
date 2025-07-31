from PIL import Image
from io import BytesIO
from pathlib import Path

def overlay_gnb_logo(ai_image_bytes: bytes) -> BytesIO:
    # Load base image from bytes
    base_image = Image.open(BytesIO(ai_image_bytes)).convert("RGBA")

    # Resolve path to logo: backend/services/ → backend/assets/gnb-white-logo.png
    logo_path = Path(__file__).resolve().parent.parent / "assets" / "gnb-white-logo.png"
    print("🔍 Using logo path:", logo_path)

    # Load and resize logo
    logo = Image.open(logo_path).convert("RGBA")
    logo_width = int(base_image.width * 0.30)
    logo_ratio = logo_width / logo.width
    logo_height = int(logo.height * logo_ratio)
    logo = logo.resize((logo_width, logo_height), Image.LANCZOS)

    # Paste in bottom-right corner with margin
    position = (
        base_image.width - logo_width - 20,
        base_image.height - logo_height - 40
    )
    base_image.paste(logo, position, logo)

    # Save to in-memory PNG
    output_buffer = BytesIO()
    base_image.save(output_buffer, format="PNG")
    output_buffer.seek(0)
    return output_buffer
