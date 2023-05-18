FROM tiangolo/uvicorn-gunicorn:python3.8

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgl1-mesa-glx \
        openssl\    
    && apt-get install libasound-dev libportaudio2 libportaudiocpp0 portaudio19-dev -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./requirements.txt ./requirements.txt
COPY ./ssl_certificate.pem ./ssl_certificate.pem
COPY ./ssl_private_key.pem ./ssl_private_key.pem

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

ENV GOOGLE_APPLICATION_CREDENTIALS=./credential.json

COPY . .


CMD ["uvicorn", "main:/app", "--host", "0.0.0.0", "--port", "8090"]