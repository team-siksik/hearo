import base64
import io

from fastapi import APIRouter, WebSocket
from ai_code.sound_classification import api
from collections import deque
from pydub import AudioSegment
from main import socket_manager, logger

router = APIRouter(prefix="/sc")

audio_data_queues = {}

@socket_manager.on("classification")
async def audio_stream(websocket: WebSocket):
    await websocket.accept()
    sid = websocket.client_id

    while True:
        data = await websocket.receive_json()

        room_id = data["room_id"]
        base64_audio = data["audio"]

        # Base64 형식의 오디오 데이터를 디코딩
        audio_data = base64.b64decode(base64_audio)

        # 0.1초 단위로 데이터를 처리하고, 1초 단위로 합쳐서 API 호출
        audio_segment = AudioSegment.from_file(io.BytesIO(audio_data), format="wav")

        if sid not in audio_data_queues:
            audio_data_queues[sid] = deque(maxlen=10)

        audio_data_queues[sid].append(audio_segment)

        # 큐에 충분한 데이터가 있으면 합쳐서 API 호출
        if len(audio_data_queues[sid]) == 10:
            combined_audio = sum(audio_data_queues[sid], AudioSegment.empty())
            combined_audio_data = io.BytesIO()
            combined_audio.export(combined_audio_data, format="wav")

            # 음성 데이터를 메모리에서 처리하기 위해 query_with_memory 함수 호출
            result = api.query_with_memory(combined_audio_data.getvalue())
            if result:
                await websocket.send_text(result)
            else:
                await websocket.send_text("No result")