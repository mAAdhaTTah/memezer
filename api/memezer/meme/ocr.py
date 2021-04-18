import os
import re
import subprocess
from pathlib import Path

from ..core.settings import settings


class OCR:
    def __init__(self) -> None:
        self._tmp_txt_base = f"{settings.MEDIA_PATH}/memeocr"
        self._tmp_txt_fname = self._tmp_txt_base + ".txt"

    def recognize(self, fname: Path) -> str:
        self._exec_tesseract(fname)
        txt = self._read_txt()
        self._delete_tmp_files()
        return txt

    def _exec_tesseract(self, fname: Path) -> None:
        subprocess.run(
            [
                "tesseract",
                "-l",
                "eng",
                str(fname),
                self._tmp_txt_base,
            ]
        )

    def _read_txt(self) -> str:
        with open(self._tmp_txt_fname) as fr:
            content = fr.read()
            blocks = re.split(r"\n\n", content)
            lines = [re.sub(r"\s+", " ", block) for block in blocks if block.strip()]
            return " ".join(lines)

    def _delete_tmp_files(self) -> None:
        if os.path.exists(self._tmp_txt_fname):
            os.remove(self._tmp_txt_fname)


ocr = OCR()
