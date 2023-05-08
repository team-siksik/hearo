from fastapi import FastAPI
from fastapi_socketio import SocketManager

app = FastAPI()
socket_manager = SocketManager(app=app)


@app.get("/socket.io")
async def socket():
    print("socket!")


@socket_manager.on("join")
async def handle_join(sid, *args, **kwargs):
    await socket_manager.emit("join", "User joined")


@socket_manager.on("test")
async def test(sid, *args, **kwargs):
    await socket_manager.emit("test", "test")


if __name__ == "__main__":
    import logging
    import sys

    logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)

    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
