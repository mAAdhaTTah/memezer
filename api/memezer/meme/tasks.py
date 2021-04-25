from uuid import UUID

from ..core.queue import queue


@queue.task
def ocr_meme(meme_id: UUID) -> None:
    from ..core.db import session
    from .models import Meme
    from .ocr import ocr

    with session() as db:
        meme = db.query(Meme).filter(Meme.id == meme_id).one()
        result = ocr.recognize_meme(meme)
        meme.ocr_results.append(result)

        if meme.accessibility_text is None:
            meme.accessibility_text = result.output

        db.commit()
