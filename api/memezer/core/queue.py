from procrastinate import AiopgConnector, App

from .settings import settings

queue = App(
    connector=AiopgConnector(
        dsn=settings.POSTGRES_DSN,
        options=f"-c search_path={settings.QUEUE_SCHEMA}",
    ),
)
