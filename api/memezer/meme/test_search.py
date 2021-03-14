from uuid import UUID

from sqlalchemy.orm.session import Session

from .models import Meme
from .search import MemeSearchParams


def test_should_query_title_by_term(db: Session, meme: Meme) -> None:
    result = Meme.get_memes_from_uploader_id(
        db, UUID(meme.uploader_id), modifier=MemeSearchParams(term="face")
    )

    assert len(result) == 1
    assert result[0] == meme


def test_should_return_empty_list_no_matching(db: Session, meme: Meme) -> None:
    result = Meme.get_memes_from_uploader_id(
        db, UUID(meme.uploader_id), modifier=MemeSearchParams(term="arrgh")
    )

    assert len(result) == 0
