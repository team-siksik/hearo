from fastapi import APIRouter

from main import socket_manager, logger


router = APIRouter(prefix="/api/v1")


@router.get("/test")
async def root():
    logger.info("root: common router api 호출")
    return {"message": "hearo!"}


@socket_manager.on("connect")
async def connect(sid, environ):
    await socket_manager.emit("info", f"{sid} connected")
    logger.info(f"connect: {sid} connected")


@socket_manager.on("disconnect")
async def disconnect(sid):
    await socket_manager.emit("info", f"{sid} disconnected")
    logger.info(f"disconnect: {sid} disconnected")


@socket_manager.on("enter_room")
async def enter_room(sid, data):
    room_id = data["room_id"]
    socket_manager.enter_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} entered room '{room_id}'")
    logger.info(f"enter_room: {sid} entered room '{room_id}'")


@socket_manager.on("leave_room")
async def leave_room(sid, data):
    room_id = data["room_id"]
    socket_manager.leave_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} left room '{room_id}'")
    logger.info(f"leave_room: {sid} left room '{room_id}'")


@socket_manager.on("close_room")
async def close_room(sid, data):
    room_id = data["room_id"]
    await socket_manager.close_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} closed room '{room_id}'")
    logger.info(f"close_room: {sid} closed room '{room_id}'")


@socket_manager.on("send_message_to_room")
async def send_message_to_room(sid, data):
    room_id = data["room_id"]
    message = data["message"]
    await socket_manager.emit("message", message, room_id, skip_sid=sid)
    await socket_manager.emit("info", f"{sid} sent message '{message}' to room '{room_id}'")
    logger.info(f"send_message_to_room: {sid} sent message '{message}' to room '{room_id}'")
