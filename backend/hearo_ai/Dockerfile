FROM tiangolo/uvicorn-gunicorn:python3.8

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8090"]