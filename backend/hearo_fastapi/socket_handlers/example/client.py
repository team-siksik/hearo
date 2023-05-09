import socketio

sio = socketio.Client()


@sio.on("info")
def info(data):
    print(f"info: {data}")


@sio.on("message")
def test(data):
    print(f"message: {data}")


sio.connect("http://localhost:8000/ws", socketio_path="/ws/socket.io", wait_timeout=5)
# sio.connect("http://k8a6031.p.ssafy.io:80/ws", socketio_path="/ws/socket.io", wait_timeout=5)
sio.wait()

sio.emit("enter_room", {"room_id": "hi"})
sio.emit("leave_room", {"room_id": "hi"})

sio.emit("disconnect")
