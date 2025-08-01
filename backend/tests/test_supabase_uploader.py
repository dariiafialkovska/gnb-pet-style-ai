# tests/test_supabase_uploader.py
from unittest.mock import patch, MagicMock
from ..services.supabase_uploader import upload_image_to_supabase

# Test successful image upload to Supabase
@patch("backend.services.supabase_uploader.supabase")
def test_upload_image_success(mock_supabase):
    mock_upload = MagicMock()
    mock_upload.upload.return_value = MagicMock(error=None)
    mock_supabase.storage.from_.return_value = mock_upload

    result = upload_image_to_supabase(b"fake-image-bytes", extension="jpeg")

    assert result.startswith("http")
    assert result.endswith(".jpeg")

# Test handling of missing environment variables
@patch("backend.services.supabase_uploader.supabase")
def test_upload_image_failure(mock_supabase):
    mock_upload = MagicMock()
    mock_upload.upload.return_value = MagicMock(error="Something went wrong")
    mock_supabase.storage.from_.return_value = mock_upload

    try:
        upload_image_to_supabase(b"bad", extension="png")
    except Exception as e:
        assert "Upload failed" in str(e)
