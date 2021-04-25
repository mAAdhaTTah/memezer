import os
from pathlib import Path
from typing import TYPE_CHECKING

from fastapi import UploadFile

if TYPE_CHECKING:
    from ..meme.models import Meme


class SaveMemeException(Exception):
    pass


class Filesystem:
    async def save_meme(self, meme: "Meme", file: UploadFile) -> None:
        try:
            await self.save_file(meme.file_path, file)
        except Exception as e:
            raise SaveMemeException from e

    async def save_file(self, save_path: Path, file: UploadFile) -> None:
        if not save_path.parent.exists():
            os.makedirs(save_path.parent)

        contents = await file.read()

        with open(save_path, "xb") as f:
            f.write(contents.encode("utf-8") if isinstance(contents, str) else contents)


fs = Filesystem()
