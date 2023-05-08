from fastapi import APIRouter

from main import socket_manager


router = APIRouter(prefix="/sd")


@router.get("/")
async def root():
    return {"message": "sd!"}
