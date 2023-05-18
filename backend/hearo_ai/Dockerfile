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

COPY . .

ENV SSL_CERT_PATH=./ssl_certificate.pem
ENV SSL_KEY_PATH=./ssl_private_key.pem

CMD ["uvicorn", "main:/app", "--host", "0.0.0.0", "--port", "80", "--ssl-keyfile",  "$SSL_KEY_PATH", "--ssl-certfile", "$SSL_CERT_PATH"]