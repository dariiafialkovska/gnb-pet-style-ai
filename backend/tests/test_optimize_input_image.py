# tests/test_optimize_input_image.py
from PIL import Image
from io import BytesIO
from ..services.optimize_images import optimize_input_image

def test_optimize_image_compression():
    # Create a large RGB image
    img = Image.new("RGB", (1024, 1024), color="red")
    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=100)
    original_bytes = buffer.getvalue()

    optimized_buffer, stats = optimize_input_image(original_bytes)

    assert isinstance(optimized_buffer, BytesIO)
    assert stats["compressed_size"] < stats["original_size"]
    assert "compression_ratio" in stats
    assert "compression_time" in stats
