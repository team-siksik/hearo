import base64
import io
import tempfile
import os

from fastapi import APIRouter, WebSocket
from ai_code.sound_classification import api
from collections import deque
from pydub import AudioSegment
from main import socket_manager, logger

router = APIRouter(prefix="/sc")

audio_data_queues = {}

@socket_manager.on("classification")
async def audio_stream(sid, data):
    base64_audio = data["audio"]

    # Base64 형식의 오디오 데이터를 디코딩
    audio_data = base64.b64decode(base64_audio)

    # 0.1초 단위로 데이터를 처리하고, 1초 단위로 합쳐서 API 호출
    audio_segment = AudioSegment.from_file(io.BytesIO(audio_data), format="wav")

    if sid not in audio_data_queues:
        audio_data_queues[sid] = deque(maxlen=10)

    audio_data_queues[sid].append(audio_segment)

    if len(audio_data_queues[sid]) != 10:
        await socket_manager.emit("result", "Loading")
        return
    
    combined_audio = sum(audio_data_queues[sid], AudioSegment.empty())

    # 최대 데시벨 확인
    if combined_audio.max_dBFS < 40:
        await socket_manager.emit("result", "Small dB")
        return  # API 요청을 하지 않고 함수 종료
    
    # combined_audio를 임시 파일로 저장
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
        temp_filename = temp_file.name
        combined_audio.export(temp_filename, format="wav")
        logger.info(f"임시 파일 경로:, {temp_filename}")  # 임시 파일 경로 출력

    # 임시 파일을 읽어서 query_with_memory 함수 호출
    with open(temp_filename, "rb") as f:
        result = api.query_with_memory(f.read())

        # 임시 파일 삭제
        os.remove(temp_filename)

        if result:
            logger.info(f"result = {result}")
            await socket_manager.emit("result", result)
        else:
            logger.info("No result")
            await socket_manager.emit("result", "No result")
