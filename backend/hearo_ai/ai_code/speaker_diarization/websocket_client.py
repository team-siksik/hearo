from __future__ import division
import asyncio
import websockets
import json
import pyaudio

FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = int(RATE / 10)

audio = pyaudio.PyAudio()

stream = audio.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)


async def microphone_client():
    print("started")
    async with websockets.connect(
            'ws://localhost:8000/') as websocket:
        await websocket.send(json.dumps({
            "rate": RATE,
            "language": 'ko-KR'
        }))
        while True:
            # print("sending")
            data = stream.read(CHUNK)
            await websocket.send(data)
            gotit = await websocket.recv()
            transcript = json.loads(gotit)
            print(transcript["final"], transcript["transcript"])


asyncio.get_event_loop().run_until_complete(microphone_client())