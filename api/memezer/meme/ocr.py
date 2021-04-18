from pathlib import Path

from PIL import Image
from pytesseract import image_to_string


class OCR:
    def recognize(self, file: Path) -> str:
        return image_to_string(Image.open(file), lang="eng").strip()


ocr = OCR()
