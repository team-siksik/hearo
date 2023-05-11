from fastapi import APIRouter

from main import socket_manager, logger


router = APIRouter(prefix="/sd")

@router.get("/test")
async def root():
    logger.info("root: sd router api 호출")
    return {"message": "hearo!"}

@socket_manager.on("audio")
async def audio(sid, data):
    audio_data = data["audio"]
    await socket_manager.emit("info", f"audio: {sid} sent audio '{audio_data}'")
    logger.info(f"audio: {sid} sent audio '{audio_data}'")