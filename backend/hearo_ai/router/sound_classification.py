import base64
import io
import tempfile
import os

from fastapi import APIRouter, WebSocket
from ai_code.sound_classification import api
from collections import deque
from pydub import AudioSegment
from main import socket_manager, logger
from speechbrain.pretrained import EncoderClassifier

router = APIRouter(prefix="/sc")

model = EncoderClassifier.from_hparams("speechbrain/urbansound8k_ecapa")
audio_data_queues = {}
prv_score = []

@socket_manager.on("classification")
async def audio_stream(sid, data):
    global prv_score
    
    base64_audio = data["audio"]

    # Base64 형식의 오디오 데이터를 디코딩
    audio_data = base64.b64decode(base64_audio)

    # 0.1초 단위로 데이터를 처리하고, 1초 단위로 합쳐서 API 호출
    audio_segment = AudioSegment.from_file(io.BytesIO(audio_data), format="wav")

    if sid not in audio_data_queues:
        audio_data_queues[sid] = deque(maxlen=10)

    audio_data_queues[sid].append(audio_segment)

    if len(audio_data_queues[sid]) != 10:
        logger.info("Loading")
        await socket_manager.emit("result", "Loading")
        return
    
    combined_audio = sum(audio_data_queues[sid], AudioSegment.empty())
    
    # combined_audio를 임시 파일로 저장
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
        temp_filename = temp_file.name
        combined_audio.export(temp_filename, format="wav")
        logger.info(f"임시 파일 경로:, {temp_filename}")  # 임시 파일 경로 출력
        logger.info(f"max_dBFS = {combined_audio.max_dBFS}")

    try:
        classification = model.classify_file(temp_filename)
        # 임시 파일 삭제
        os.remove(temp_filename)
        
        if classification[0].tolist()[0] == prv_score:
            result = "Mic error"
        else:
            result = classification[-1][0]
            prv_score = classification[0].tolist()[0]
        logger.info(result)
        await socket_manager.emit("result", result)
    
    except:
        logger.info("No result")
        await socket_manager.emit("result", "No result")
