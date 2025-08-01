# backend/convert_to_png.py
from io import BytesIO
from PIL import Image

# Function to convert image bytes to PNG format
def convert_to_png(file_bytes: bytes) -> bytes:
    with BytesIO(file_bytes) as input_io:
        with Image.open(input_io) as img:
            output_io = BytesIO()
            img.convert("RGBA").save(output_io, format="PNG")
            return output_io.getvalue()
