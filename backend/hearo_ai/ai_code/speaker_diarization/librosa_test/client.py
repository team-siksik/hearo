import socketio
import base64
import sounddevice as sd


sio = socketio.Client()

# 1. 소켓 연결
# sio.connect("http://localhost:80/ws", socketio_path="/ws/socket.io", wait_timeout=5)  # 로컬 테스트
sio.connect("http://k8a6031.p.ssafy.io:80/ws", socketio_path="/ws/socket.io", wait_timeout=5)  # 서버 테스트

# 2. 방 입장
sio.emit("enter_room", {"room_id": "speaker_diarization_test"})

# 3. 음성 전송 테스트
def audio_callback(indata, frames, time, status):
    audio_data = base64.b64encode(indata.tobytes()).decode('utf-8')
    sio.emit('audio2', {"room_id": "speaker_diarization_test", "audio": audio_data})

with sd.InputStream(callback=audio_callback):
    sd.sleep(int(1000))

# 4. 방 퇴장 및 삭제
sio.emit("close_room", {"room_id": "speaker_diarization_test"})

# 5. 소켓 연결 해제
sio.emit("disconnect")
