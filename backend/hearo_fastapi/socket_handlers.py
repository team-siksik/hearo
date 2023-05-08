from main import socket_manager


@socket_manager.on("connect")
async def connect(sid, environ):
    await socket_manager.emit("info", f"{sid} connected")
    print(f"[connect] {sid} connected")


@socket_manager.on("disconnect")
async def disconnect(sid):
    await socket_manager.emit("info", f"{sid} disconnected")
    print(f"[disconnect] {sid} disconnected")


@socket_manager.on("enter_room")
async def enter_room(sid, data):
    room_id = data["room_id"]
    await socket_manager.enter_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} entered room '{room_id}'")
    print(f"[enter_room] {sid} entered room '{room_id}'")


@socket_manager.on("leave_room")
async def leave_room(sid, data):
    room_id = data["room_id"]
    await socket_manager.leave_room(sid, room_id)
    await socket_manager.emit("info", f"{sid} left room '{room_id}'")
    print(f"[leave_room] {sid} left room '{room_id}'")


@socket_manager.on("send_message_to_room")
async def send_message_to_room(sid, data):
    room_id = data["room_id"]
    message = data["message"]
    await socket_manager.emit("message", message, room_id, skip_sid=sid)
    await socket_manager.emit(
        "info", f"{sid} sent message '{message}' to room '{room_id}'"
    )
    print(f"[send_message_to_room] {sid} sent message '{message}' to room '{room_id}'")
