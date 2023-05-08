import socketio

sio = socketio.Client()


@sio.on("join")
def join(data):
    print("Joined!")
    print(data)


@sio.on("test")
def test(data):
    print("Message Received!")
    print(data)


sio.connect("http://127.0.0.1:8000/ws", socketio_path="/ws/socket.io", wait_timeout=5)
sio.wait()
