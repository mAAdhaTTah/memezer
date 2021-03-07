FROM python:3.9.0 as api_build

WORKDIR /app

COPY ./api/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

ARG INSTALL_DEV=false
COPY ./api/requirements.dev.txt requirements.dev.txt
RUN bash -c "if [ $INSTALL_DEV == 'true' ]; then pip install --no-cache-dir -r requirements.dev.txt; fi"

FROM node:14.15.4 as web_build

ENV SKIP_PREFLIGHT_CHECK=true

WORKDIR /app

COPY ./web/tsconfig.json tsconfig.json
COPY ./web/package.json package.json
COPY ./web/package-lock.json package-lock.json

RUN npm ci

COPY ./web/src src
COPY ./web/public public

RUN npm run build

FROM python:3.9.0 as app

ENV PYTHONPATH /app

COPY --from=api_build /usr/local/lib/python3.9 /usr/local/lib/python3.9
COPY --from=api_build /usr/local/bin /usr/local/bin

WORKDIR /app

COPY --from=web_build /app/build ./build

COPY ./api/alembic.ini alembic.ini
COPY ./api/memezer memezer
COPY ./api/alembic alembic
COPY ./api/gunicorn.conf.py gunicorn.conf.py

EXPOSE 8080

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "--config", "gunicorn.conf.py", "memezer.wsgi:app"]