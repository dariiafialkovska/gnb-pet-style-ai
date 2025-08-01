# tests/test_overlay_gnb_logo.py
from PIL import Image
from io import BytesIO
from ..services.logo_overlay import overlay_gnb_logo

def test_overlay_gnb_logo_adds_logo():
    base_img = Image.new("RGBA", (500, 500), color=(255, 255, 255, 255))
    buffer = BytesIO()
    base_img.save(buffer, format="PNG")
    base_bytes = buffer.getvalue()

    result = overlay_gnb_logo(base_bytes)

    # Validate output
    assert isinstance(result, BytesIO)
    result.seek(0)
    result_img = Image.open(result)
    assert result_img.size == (500, 500)
    assert result_img.format == "PNG"
