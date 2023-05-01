import asyncio
import websockets
import sys
import wave
import base64
import time
import librosa
from diart.utils import encode_audio

async def run_test(uri):
    async with websockets.connect(uri) as websocket:
        wf, rate = librosa.load(sys.argv[1], sr=16000)
        for i in range(0, len(wf), 8000):
            encoded_string = encode_audio(wf[i:i+8000])
            print(str(encoded_string))
            if len(encoded_string) == 0:
                 break
            
            await websocket.send(str(encoded_string))
            time.sleep(0.1)
        while True:
            print(await websocket.recv())

asyncio.run(run_test('ws://localhost:8090'))