from fastapi import APIRouter
from main import socket_manager, logger

import base64
import librosa
import io
import numpy as np

router = APIRouter(prefix="/sd")


@router.get("/test")
async def root():
    logger.info("root: sd router api 호출")
    return {"message": "hearo!"}


@socket_manager.on("waveform")
async def waveform(sid, data):
    logger.info(f"waveform: {sid} sent audio")

    room_id = data["room_id"]
    audio_data = data["audio"]

    await socket_manager.emit("info", f"{sid} sent audio", room_id)

    binary_data = base64.b64decode(audio_data)

    buffer = io.BytesIO(binary_data)
    audio, sr = librosa.load(buffer, sr=None)
    stft = np.abs(librosa.stft(audio))
    spectral_centroids = librosa.feature.spectral_centroid(S=stft, sr=sr)
    logger.info(spectral_centroids)

    average = np.mean(np.array(spectral_centroids).flatten())
    logger.info(average)
