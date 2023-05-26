import socketio
import base64
import cv2


sio = socketio.Client()


@sio.on("info")
def info(data):
    print(f"info: {data}")


@sio.on("word")
def word(data):
    print(f"word: {data}")


@sio.on("sentence")
def sentence(data):
    print(f"sentence: {data}")


# 1. 소켓 연결
sio.connect("http://localhost:80/ws", socketio_path="/ws/socket.io", wait_timeout=5)  # 로컬 테스트
# sio.connect("http://k8a6031.p.ssafy.io:80/ws", socketio_path="/ws/socket.io", wait_timeout=5)  # 서버 테스트

# 2. 방 입장
sio.emit("enter_room", {"room_id": "sl_recognition_test"})

# 3. 이미지 전송 테스트
image = cv2.imread("image/example.jpg")
buffer = cv2.imencode('.jpg', image)[1]
image_string = base64.b64encode(buffer).decode('utf-8')
sio.emit("image", {"room_id": "sl_recognition_test", "base64_string": image_string})

# 4. 방 퇴장 및 삭제
sio.emit("close_room", {"room_id": "sl_recognition_test"})

# 5. 소켓 연결 해제
sio.emit("disconnect")
