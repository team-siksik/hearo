import asyncio
import websockets
import sys
import wave
import base64
import time

async def run_test(uri):
    async with websockets.connect(uri) as websocket:

        wf = wave.open(sys.argv[1], "rb")
        while True:
            encoded_string = base64.encodebytes(wf.readframes(1024))
            print(encoded_string)
            if len(encoded_string) == 0:
                 break
            
            await websocket.send(str(encoded_string))
            time.sleep(0.1)

asyncio.run(run_test('ws://localhost:7007'))