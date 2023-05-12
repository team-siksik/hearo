from fastapi import APIRouter
from main import socket_manager, logger
from google.cloud import speech
from google.cloud.speech import enums, types
from collections import deque


router = APIRouter(prefix="/sd")

# 버퍼 크기 (1초에 해당하는 샘플 수)
RATE=16000
BUFFER_SIZE = RATE  # 예시로 버퍼 크기를 RATE로 설정했습니다.
# 음성 데이터를 저장하는 버퍼
audio_buffer = deque(maxlen=BUFFER_SIZE)

@router.get("/test")
async def root():
    logger.info("root: sd router api 호출")
    return {"message": "hearo!"}


@socket_manager.on("audio")
async def audio(sid, data):
    audio_data = data["audio"]

    # 버퍼에 음성 데이터 추가
    audio_buffer.extend(audio_data)

    # 버퍼가 가득 찼을 때 STT 실행
    if len(audio_buffer) == BUFFER_SIZE:
        # Process audio using Google Cloud Speech-to-Text
        language_code = "ko-KR"  # Language code for speech recognition
        client = speech.SpeechClient()
        config = types.RecognitionConfig(
            sample_rate_hertz=RATE,
            language_code=language_code,
        )
        streaming_config = types.StreamingRecognitionConfig(config=config, interim_results=True)

        def request_generator():
            # 버퍼에서 1초에 해당하는 음성 데이터를 가져와서 생성
            audio_content = b"".join(audio_buffer)
            yield speech.StreamingRecognizeRequest(audio_content=audio_content)

        responses = client.streaming_recognize(streaming_config, request_generator())

        # Process streaming responses
        for response in responses:
            for result in response.results:
                if result.alternatives:
                    transcript = result.alternatives[0].transcript
                    await socket_manager.emit("transcription", transcript)  # Emit transcription to the client

        # 처리가 완료된 음성 데이터는 버퍼에서 제거
        audio_buffer.clear()