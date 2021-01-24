FROM python:3.9.0 as api_build

WORKDIR /app

COPY ./requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

ARG INSTALL_DEV=false
COPY ./requirements.dev.txt requirements.dev.txt
RUN bash -c "if [ $INSTALL_DEV == 'true' ]; then pip install --no-cache-dir -r requirements.dev.txt; fi"

FROM python:3.9.0 as app

ENV PYTHONPATH /app

COPY --from=api_build /usr/local/lib/python3.9 /usr/local/lib/python3.9
COPY --from=api_build /usr/local/bin /usr/local/bin

WORKDIR /app

ADD ./gunicorn.conf.py gunicorn.conf.py
COPY ./memezer memezer

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "--config", "gunicorn.conf.py", "memezer.wsgi:app"]