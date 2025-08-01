import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from io import BytesIO
import base64
from backend.main import app

client = TestClient(app)


@pytest.fixture
def dummy_file():
    return ("dog.jpg", BytesIO(b"fake-image-bytes"), "image/jpeg")


@pytest.fixture
def non_image_file():
    return ("text.txt", BytesIO(b"not-an-image"), "text/plain")


@pytest.fixture
def webp_file():
    return ("dog.webp", BytesIO(b"webp-bytes"), "image/webp")


@patch("backend.routes.generate.upload_image_to_supabase")
@patch("backend.routes.generate.overlay_gnb_logo")
@patch("backend.routes.generate.client.images.edit")
@patch("backend.routes.generate.optimize_input_image")
@patch("backend.routes.generate.build_prompt")
def test_generate_success(
    mock_build_prompt,
    mock_optimize_input,
    mock_openai_edit,
    mock_overlay,
    mock_upload,
    dummy_file
):
    mock_build_prompt.return_value = "Mock prompt"
    optimized_img = BytesIO(b"optimized")
    optimized_img.name = "dog.jpg"
    mock_optimize_input.return_value = (
        optimized_img,
        {
            "compression_time": 0.05,
            "compression_ratio": 50.0,
            "original_size": 1000000,
            "compressed_size": 500000
        }
    )
    mock_openai_edit.return_value = MagicMock(
        data=[MagicMock(b64_json=base64.b64encode(b"ai-image").decode())]
    )

    mock_overlay.return_value = BytesIO(b"final-image")
    mock_overlay.return_value.getvalue = lambda: b"final-image"
    mock_upload.return_value = "https://cdn.supabase.io/image.jpg"

    response = client.post(
        "/api/generate",
        files={"file": dummy_file},
        data={"scenario": "Lavender Chill", "clothing": "Poncho"}
    )

    assert response.status_code == 200
    json_data = response.json()
    assert "image_url" in json_data
    assert json_data["image_url"].startswith("https://")
    assert "performance" in json_data
    assert "openai_time" in json_data["performance"]


@patch("backend.routes.generate.client.images.edit", side_effect=Exception("OpenAI failed"))
@patch("backend.routes.generate.upload_image_to_supabase")
@patch("backend.routes.generate.overlay_gnb_logo")
@patch("backend.routes.generate.optimize_input_image")
@patch("backend.routes.generate.build_prompt")
def test_generate_openai_failure(
    mock_build_prompt,
    mock_optimize_input,
    mock_overlay,
    mock_upload,
    mock_openai_edit,
    dummy_file
):
    mock_build_prompt.return_value = "Fail prompt"
    mock_optimize_input.return_value = (BytesIO(b"optimized"), {
        "compression_time": 0.02,
        "compression_ratio": 40.0,
        "original_size": 800000,
        "compressed_size": 480000
    })

    response = client.post(
        "/api/generate",
        files={"file": dummy_file},
        data={"scenario": "Grapefruit Getaway", "clothing": "Bandana"}
    )

    assert response.status_code == 200
    json_data = response.json()
    assert "error" in json_data
    assert json_data["error"] == "OpenAI failed"


@patch("backend.routes.generate.convert_to_png")
@patch("backend.routes.generate.client.images.edit")
@patch("backend.routes.generate.optimize_input_image")
@patch("backend.routes.generate.upload_image_to_supabase")
@patch("backend.routes.generate.overlay_gnb_logo")
@patch("backend.routes.generate.build_prompt")
def test_generate_triggers_png_conversion(
    mock_build_prompt,
    mock_overlay,
    mock_upload,
    mock_optimize_input,
    mock_openai_edit,
    mock_convert,
    webp_file
):
    mock_build_prompt.return_value = "PNG convert prompt"
    mock_convert.return_value = b"converted-png"
    optimized = BytesIO(b"optimized")
    optimized.name = "dog.jpg"
    mock_optimize_input.return_value = (optimized, {
        "compression_time": 0.03,
        "compression_ratio": 45.0,
        "original_size": 900000,
        "compressed_size": 500000
    })
    mock_openai_edit.return_value = MagicMock(data=[{
        "b64_json": base64.b64encode(b"ai-image").decode()
    }])
    mock_overlay.return_value = BytesIO(b"final")
    mock_overlay.return_value.getvalue = lambda: b"final"
    mock_upload.return_value = "https://cdn.supabase.io/converted.jpg"

    response = client.post(
        "/api/generate",
        files={"file": webp_file},
        data={"scenario": "Mahogany Coconut Lounge", "clothing": "Sweater"}
    )

    assert response.status_code == 200
    assert mock_convert.called


def test_generate_missing_file():
    response = client.post("/api/generate", data={"scenario": "Any", "clothing": "Any"})
    assert response.status_code == 422  # FastAPI validation


@patch("backend.routes.generate.client.images.edit")
@patch("backend.routes.generate.optimize_input_image")
@patch("backend.routes.generate.upload_image_to_supabase", side_effect=Exception("Supabase down"))
@patch("backend.routes.generate.overlay_gnb_logo")
@patch("backend.routes.generate.build_prompt")
def test_generate_upload_failure(
    mock_prompt,
    mock_overlay,
    mock_upload,
    mock_optimize,
    mock_edit,
    dummy_file
):
    mock_prompt.return_value = "Prompt"
    mock_edit.return_value = MagicMock(
        data=[MagicMock(b64_json=base64.b64encode(b"ai-image").decode())]
    )

    mock_optimize.return_value = (BytesIO(b"opt"), {
        "compression_time": 0.02,
        "compression_ratio": 70.0,
        "original_size": 1000000,
        "compressed_size": 300000
    })
    overlay_img = BytesIO(b"overlay")
    overlay_img.getvalue = lambda: b"overlay"
    mock_overlay.return_value = overlay_img

    response = client.post(
        "/api/generate",
        files={"file": dummy_file},
        data={"scenario": "Failure test", "clothing": "Scarf"}
    )

    assert response.status_code == 200
    assert "error" in response.json()
    assert "Supabase down" in response.json()["error"]


@patch("backend.routes.generate.build_prompt")
def test_generate_with_missing_optional_fields(mock_prompt, dummy_file):
    mock_prompt.return_value = "Default prompt"

    with patch("backend.routes.generate.optimize_input_image") as mock_optimize, \
         patch("backend.routes.generate.client.images.edit") as mock_edit, \
         patch("backend.routes.generate.overlay_gnb_logo") as mock_overlay, \
         patch("backend.routes.generate.upload_image_to_supabase") as mock_upload:

        optimized = BytesIO(b"opt")
        optimized.name = "dog.jpg"
        mock_optimize.return_value = (optimized, {
            "compression_time": 0.01,
            "compression_ratio": 60,
            "original_size": 500000,
            "compressed_size": 200000
        })
        mock_edit.return_value = MagicMock(data=[{
            "b64_json": base64.b64encode(b"ai-image").decode()
        }])
        mock_overlay.return_value = BytesIO(b"final")
        mock_overlay.return_value.getvalue = lambda: b"final"
        mock_upload.return_value = "https://cdn.supabase.io/image.jpg"

        response = client.post("/api/generate", files={"file": dummy_file})
        assert response.status_code == 200
        mock_prompt.assert_called_with(None, None)
