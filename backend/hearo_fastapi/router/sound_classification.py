from fastapi import APIRouter

from main import socket_manager


router = APIRouter(prefix="/sc")


@router.get("/")
async def root():
    return {"message": "sc!"}
