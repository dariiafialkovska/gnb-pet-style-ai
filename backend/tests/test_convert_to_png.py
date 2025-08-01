# tests/test_convert_to_png.py
from ..services.convert_to_png import convert_to_png
from PIL import Image
from io import BytesIO

def test_convert_to_png_returns_valid_png():
    # Create a dummy JPEG image
    img = Image.new("RGB", (100, 100), color="blue")
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    jpeg_bytes = buffer.getvalue()

    result = convert_to_png(jpeg_bytes)

    # Assert result is PNG
    assert isinstance(result, bytes)
    assert result[:8] == b"\x89PNG\r\n\x1a\n"  # PNG file signature
