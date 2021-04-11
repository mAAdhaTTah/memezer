FROM python:3.9.0 as api_build

LABEL name="memezer" \
    maintainer="James DiGioia <jamesorodig@gmail.com>" \
    description="Meme organizer" \
    homepage="https://github.com/mAAdhaTTah/memezer" \
    documentation="https://github.com/mAAdhaTTah/memezer/wiki"

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
# System-level base config
ENV TZ=UTC \
    LANGUAGE=en_US:en \
    LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    PYTHONIOENCODING=UTF-8 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# Application-level base config
ENV MEDIA_DIR=/media \
    MEMEZER_USER="memezer"

# Create non-privileged user for memezer
RUN groupadd --system $MEMEZER_USER \
    && useradd --system --create-home --gid $MEMEZER_USER $MEMEZER_USER

RUN apt-get update && \
    apt-get install -y \
    tesseract-ocr \
    gosu \
    dumb-init

COPY --from=api_build /usr/local/lib/python3.9 /usr/local/lib/python3.9
COPY --from=api_build /usr/local/bin /usr/local/bin

WORKDIR /app

COPY --from=web_build /app/build ./build

COPY ./api/alembic.ini alembic.ini
COPY ./api/memezer memezer
COPY ./api/alembic alembic
COPY ./api/gunicorn.conf.py gunicorn.conf.py
COPY ./docker_entrypoint.sh /docker_entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["dumb-init", "--", "/docker_entrypoint.sh"]
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "--config", "gunicorn.conf.py", "memezer.app:wsgi"]
