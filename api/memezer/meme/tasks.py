from datetime import datetime

from ..core.db import session
from ..core.queue import queue
from .ocr import ocr


@queue.task
def ocr_meme(meme_id: str) -> None:
    from .models import Meme, OCRResult

    with session() as db:
        started_at = datetime.now()
        meme = db.query(Meme).filter(Meme.id == meme_id).one()
        txt = ocr.recognize(meme.file_path)
        meme.ocr_results.append(OCRResult(started_at=started_at, txt=txt))

        if meme.accessibility_text is None:
            meme.accessibility_text = txt

        db.commit()
