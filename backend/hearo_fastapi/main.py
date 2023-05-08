from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi_socketio import SocketManager


app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

socket_manager = SocketManager(app)


@app.get("/")
async def root():
    return {"message": "hearo!"}


@app.get("/test", response_class=HTMLResponse)
async def test():
    f = open("socket-test.html", encoding="UTF-8")
    r = f.read()
    return HTMLResponse(content=r)


@app.get("/socket.io")
async def socket():
    return {"hi"}


@socket_manager.on("connect")
async def connect(sid):
    await socket_manager.emit("info", f"{sid} connected")
    print(f"{sid} connected")


@socket_manager.on("disconnect")
async def disconnect(sid):
    await socket_manager.emit("info", f"{sid} disconnected")
    print(f"{sid} disconnected")


@socket_manager.on("enter_room")
async def enter_room(sid, data):
    room_id = data["room_id"]
    await socket_manager.enter_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} entered room '{room_id}'")
    print(f"{sid} entered room '{room_id}'")


@socket_manager.on("leave_room")
async def leave_room(sid, data):
    room_id = data["room_id"]
    await socket_manager.leave_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} left room '{room_id}'")
    print(f"{sid} left room '{room_id}'")


@socket_manager.on("send_message_to_room")
async def send_message_to_room(sid, data):
    room_id = data["room_id"]
    message = data["message"]
    await socket_manager.emit("message", message, room_id, skip_sid=sid)
    await socket_manager.emit(
        "info", f"{sid} sent message '{message}' to room '{room_id}'"
    )
    print(f"{sid} sent message '{message}' to room '{room_id}'")
