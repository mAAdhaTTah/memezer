from sqlalchemy.orm import Session

from .models import Meme
from .schemas import MemeUpdate


def test_should_touch_updated_at_on_save(db: Session, meme: Meme) -> None:
    old_updated_at = meme.updated_at

    meme.title = "Update title"
    db.commit()
    db.refresh(meme)

    assert meme.updated_at != old_updated_at


def test_should_touch_updated_at_on_update(db: Session, meme: Meme) -> None:
    old_updated_at = meme.updated_at

    Meme.update_meme_owned_by(
        db,
        meme.id,
        meme.uploader_id,
        update=MemeUpdate(title="New title", accessibility_text="New overlay text"),
    )
    db.refresh(meme)

    assert meme.updated_at != old_updated_at
