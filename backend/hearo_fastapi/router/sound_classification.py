from fastapi import APIRouter

from main import socket_manager, logger


router = APIRouter(prefix="/sc")

@router.get("/test")
async def root():
    logger.info("root: sc router api 호출")
    return {"message": "hearo!"}
