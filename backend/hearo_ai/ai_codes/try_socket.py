# import asyncio
# import websockets
# import time
# import librosa
# from diart.utils import encode_audio
# import pyaudio
# import numpy as np
# CHUNK = 1024
# FORMAT = pyaudio.paFloat32
# CHANNELS = 1
# RATE = 16000        
# p = pyaudio.PyAudio()
# stream = p.open(format=FORMAT,
#                 channels=CHANNELS,
#                 rate=RATE,
#                 input=True,
#                 frames_per_buffer=CHUNK)
# async def run_test(uri):
#     async with websockets.connect(uri) as websocket:
#         while True:
#             data = stream.read(CHUNK)
#             audio = np.frombuffer(data, dtype=np.float32)
#             audio_preprocessed = librosa.resample(audio, RATE, 8000)
#             print("working")
#             encoded_string = encode_audio(audio_preprocessed)
#             print(encoded_string)
#             await websocket.send(str(encoded_string))
#             print(await websocket.recv())
#             time.sleep(0.1)

# asyncio.run(run_test('ws://localhost:8000'))


from pathlib import Path
from threading import Thread
from typing import Optional

import diart.argdoc as argdoc
import diart.sources as src
import diart.utils as utils
import numpy as np
import rx.operators as ops
from websocket import WebSocket

STEP = 0.5
SAMPLE_RATE = 16000
OUTPUT_FILE = "output.txt"

def send_audio(ws: WebSocket, step: float, sample_rate: int):
    # Create audio source
    block_size = int(np.rint(step * sample_rate))
    device = 1
    audio_source = src.MicrophoneAudioSource(sample_rate, block_size, device)

    # Encode audio, then send through websocket
    audio_source.stream.pipe(
        ops.map(utils.encode_audio)
    ).subscribe_(ws.send)

    # Start reading audio
    audio_source.read()


def receive_audio(ws: WebSocket, output: Optional[Path]):
    while True:
        message = ws.recv()
        print(f"Received: {message}", end="")

def run():
    # Run websocket client
    ws = WebSocket()
    ws.connect('ws://localhost:8000')
    sender = Thread(target=send_audio, args=[ws, STEP, SAMPLE_RATE])
    receiver = Thread(target=receive_audio, args=[ws, OUTPUT_FILE])
    sender.start()
    receiver.start()


if __name__ == "__main__":
    run()