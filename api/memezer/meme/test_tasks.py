from unittest import mock

from sqlalchemy.orm import Session

from .models import Meme
from .ocr import ocr
from .tasks import ocr_meme


def test_should_save_recognized_text(db: Session, meme: Meme) -> None:
    with mock.patch.object(
        ocr, "recognize", return_value="Recognized text"
    ) as mock_recognize:
        ocr_meme(str(meme.id))

        db.refresh(meme)

        mock_recognize.assert_called_with(meme.file_path)

        assert meme.accessibility_text == "Recognized text"
        assert len(meme.ocr_results) == 1

        assert meme.ocr_results[0].output == "Recognized text"


def test_should_not_overwrite_accessibility_text(db: Session, meme: Meme) -> None:
    with mock.patch.object(
        ocr, "recognize", return_value="Recognized text"
    ) as mock_recognize:
        meme.accessibility_text = "Original text"
        db.commit()

        ocr_meme(str(meme.id))

        db.refresh(meme)

        mock_recognize.assert_called_with(meme.file_path)

        assert meme.accessibility_text == "Original text"
        assert len(meme.ocr_results) == 1

        assert meme.ocr_results[0].output == "Recognized text"
