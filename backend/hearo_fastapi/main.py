from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager

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

# cors 설정
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from router import common, sl_recognition, sound_classification, speaker_diarization


# 라우터 설정
common.router.include_router(sl_recognition.router)
common.router.include_router(sound_classification.router)
common.router.include_router(speaker_diarization.router)

app.include_router(common.router)
