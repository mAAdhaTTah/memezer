from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm.query import Query

from ..core.db import ModifiesQuery
from .models import Meme


class MemeSearchParams(ModifiesQuery[Meme]):
    def __init__(self, term: Optional[str] = None):
        self.term = term

    def modify_query(self, query: "Query[Meme]") -> "Query[Meme]":
        if self.term is not None:
            query = query.filter(
                or_(
                    Meme.title.ilike(f"%{self.term}%"),
                    Meme.filename.ilike(f"%{self.term}%"),
                    Meme.accessibility_text.ilike(f"%{self.term}%"),
                )
            )

        return query
