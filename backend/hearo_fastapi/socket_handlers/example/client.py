import socketio

sio = socketio.Client()


@sio.on("info")
def info(data):
    print(f"info: {data}")


@sio.on("message")
def test(data):
    print(f"message: {data}")


sio.connect("http://127.0.0.1:8000/ws", socketio_path="/ws/socket.io", wait_timeout=5)
sio.wait()

sio.emit("enter_room", "hi")
sio.emit("leave_room", "hi")

sio.emit("disconnect")
