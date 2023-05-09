from fastapi import APIRouter

import base64
import cv2
import numpy as np

from main import socket_manager, logger


router = APIRouter(prefix="/sl")


@router.get("/test")
async def root():
    logger.info("root: sl router api 호출")
    return {"message": "hearo!"}


async def decode_image(base64_string):
    # base64 -> numpy array
    np_arr = np.fromstring(base64.b64decode(base64_string), np.uint8)
    # numpy array -> opencv image
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return image


global sequence
sequence = []


@socket_manager.on("image")
async def image(base64_string):
    # 이미지 변환
    image = await decode_image(base64_string)

    # 키포인트 추출
