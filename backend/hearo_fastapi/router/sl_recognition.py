from fastapi import APIRouter

from main import socket_manager


router = APIRouter(prefix="/sl")


@router.get("/")
async def root():
    return {"message": "sl!"}
