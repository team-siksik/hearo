from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager
import ssl
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
import logging
import sys

# logger 설정
logger = logging.getLogger("hearo_logger")
logger.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
console_handler.setFormatter(formatter)

logger.addHandler(console_handler)

# fastapi app 생성
app = FastAPI()

# socket 설정
socket_manager = SocketManager(app)

# SSL 컨텍스트 생성
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain("/app/ssl_certificate.pem", "/app/ssl_private_key.pem")

# FastAPI 애플리케이션에 SSL 컨텍스트 설정
app.ssl_context = ssl_context

# cors 설정
origins = ["https://k8a603.p.ssafy.io", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(HTTPSRedirectMiddleware)

from router import common, sl_recognition, sound_classification, speaker_diarization, text_generate

# 라우터 설정
common.router.include_router(sl_recognition.router)
common.router.include_router(sound_classification.router)
common.router.include_router(speaker_diarization.router)
common.router.include_router(text_generate.router)

app.include_router(common.router)
