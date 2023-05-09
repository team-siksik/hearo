from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager

import logging, sys


logger = logging.getLogger("hearo_logger")
logger.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
console_handler.setFormatter(formatter)

logger.addHandler(console_handler)


router = APIRouter(prefix="/api/v1")

app = FastAPI()

socket_manager = SocketManager(app)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@router.get("/")
async def root():
    logger.info("root: api 호출")
    return {"message": "hearo!"}


@socket_manager.on("connect")
async def connect(sid, environ):
    logger.info(f"connect: {sid} wants to connect")
    await socket_manager.emit("info", f"{sid} connected")
    logger.info(f"connect: {sid} connected")


@socket_manager.on("disconnect")
async def disconnect(sid):
    logger.info(f"disconnect: {sid} wants to disconnect")
    await socket_manager.emit("info", f"{sid} disconnected")
    logger.info(f"disconnect: {sid} disconnected")


@socket_manager.on("enter_room")
async def enter_room(sid, data):
    room_id = data["room_id"]
    logger.info(f"enter_room: {sid} wants to enter room '{room_id}'")
    socket_manager.enter_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} entered room '{room_id}'")
    logger.info(f"enter_room: {sid} entered room '{room_id}'")


@socket_manager.on("leave_room")
async def leave_room(sid, data):
    room_id = data["room_id"]
    logger.info(f"leave_room: {sid} wants to leave room '{room_id}'")
    socket_manager.leave_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} left room '{room_id}'")
    logger.info(f"leave_room: {sid} left room '{room_id}'")


@socket_manager.on("send_message_to_room")
async def send_message_to_room(sid, data):
    room_id = data["room_id"]
    message = data["message"]
    logger.info(
        f"send_message_to_room: {sid} wants to send message '{message}' to room '{room_id}'"
    )
    await socket_manager.emit("message", message, room_id, skip_sid=sid)
    await socket_manager.emit(
        "info", f"{sid} sent message '{message}' to room '{room_id}'"
    )
    logger.info(
        f"send_message_to_room: {sid} sent message '{message}' to room '{room_id}'"
    )


app.include_router(router)
