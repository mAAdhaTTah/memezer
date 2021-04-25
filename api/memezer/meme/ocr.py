from datetime import datetime
from pathlib import Path

from PIL import Image
from pytesseract import image_to_string

from .models import Meme, OCRResult


class OCR:
    def recognize_meme(self, meme: Meme) -> OCRResult:
        started_at = datetime.now()
        output = self.recognize(meme.file_path)
        return OCRResult(started_at=started_at, output=output)

    def recognize(self, file: Path) -> str:
        return image_to_string(Image.open(file), lang="eng").strip()


ocr = OCR()
