from fastapi import APIRouter

from main import socket_manager, logger


router = APIRouter(prefix="/sd")

@router.get("/test")
async def root():
    logger.info("root: sd router api 호출")
    return {"message": "hearo!"}
