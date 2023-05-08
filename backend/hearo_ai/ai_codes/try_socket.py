import asyncio
import websockets
import sys
import wave
import base64
import time
import pyaudio
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
p = pyaudio.PyAudio()

stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)
async def run_test(uri):
    async with websockets.connect(uri) as websocket:
        while True:
            data = stream.read(CHUNK)
            encoded_string = base64.b64encode(data)
            # print(encoded_string)
            if len(data) == 0:
                 break
            print("sending")
            await websocket.send(str(encoded_string)[1:])
            time.sleep(0.1)
            print("receiving")
            print(websocket.recv())

asyncio.run(run_test('ws://localhost:8000'))
