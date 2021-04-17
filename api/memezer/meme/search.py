from typing import Optional
from uuid import UUID

from fastapi import Depends
from fastapi import Query as QueryParam
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.sqlalchemy import paginate_query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from sqlalchemy.orm.query import Query

from ..core.db import ModifiesQuery
from .models import Meme


class MemeSearchParams(ModifiesQuery[Meme]):
    def __init__(
        self, term: Optional[str] = QueryParam(None, description="Search term")
    ):
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


class MemePageParams(ModifiesQuery[Meme]):
    def __init__(self, params: Params = Depends(Params)):
        self.params = params

    def modify_query(self, query: "Query[Meme]") -> "Query[Meme]":
        return paginate_query(query, self.params)


class MemeParams:
    def __init__(
        self,
        search: MemeSearchParams = Depends(MemeSearchParams),
        page: MemePageParams = Depends(MemePageParams),
    ):
        self.search = search
        self.page = page

    def respond(self, db: Session, user_id: UUID) -> Page[Meme]:
        # This isn't a great setup, but mypy isn't playing nice with paginate
        # and we need to split up the two query modifications because we need
        # to `count` against the un-paginated query.
        query = Meme.get_memes_owned_by(db, user_id, modifiers=[self.search]).order_by(
            Meme.uploaded_at.desc()
        )
        total = query.count()
        items = self.page.modify_query(query).all()

        return Page.create(
            total=total,
            items=items,
            params=self.page.params,
        )
