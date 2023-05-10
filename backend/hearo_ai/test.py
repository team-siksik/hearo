import asyncio
import websockets
import json
import threading
from six.moves import queue
from google.cloud import speech
from google.cloud.speech import types
from google.cloud.speech import enums
import os


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Coding/S08P31A603/backend/hearo_ai/credential.json"



IP = 'localhost'
PORT = 8000

class Transcoder(object):
    """
    Converts audio chunks to text
    """
    def __init__(self):
        self.buff = queue.Queue()
        self.encoding = enums.RecognitionConfig.AudioEncoding.LINEAR16
        self.language = "ko-KR"
        self.rate = 16000
        self.closed = True
        self.transcript = None

    def start(self):
        """Start up streaming speech call"""
        threading.Thread(target=self.process).start()

    def response_loop(self, responses):
        """
        Pick up the final result of Speech to text conversion
        """
        for response in responses:
            if not response.results:
                continue
            result = response.results[0]
            if not result.alternatives:
                continue
            transcript = result.alternatives[0].transcript
            if result.is_final:
                self.transcript = transcript

    def process(self):
        """
        Audio stream recognition and result parsing
        """
        #You can add speech contexts for better recognition
        client = speech.SpeechClient()
        config = types.RecognitionConfig(
            encoding=self.encoding,
            sample_rate_hertz=self.rate,
            language_code=self.language,
            max_alternatives=1,
        )
        streaming_config = types.StreamingRecognitionConfig(
            config=config,
            interim_results=True)
        audio_generator = self.stream_generator()
        requests = (types.StreamingRecognizeRequest(audio_content=content)
                    for content in audio_generator)

        responses = client.streaming_recognize(streaming_config, requests)
        try:
            self.response_loop(responses)
        except Exception as e:
            print(e)
            self.start()

    def stream_generator(self):
        while not self.closed:
            chunk = self.buff.get()
            if chunk is None:
                return
            data = [chunk]
            while True:
                try:
                    chunk = self.buff.get(block=False)
                    if chunk is None:
                        return
                    data.append(chunk)
                except queue.Empty:
                    break
            yield b''.join(data)

    def write(self, data):
        """
        Writes data to the buffer
        """
        self.buff.put(data)


async def audio_processor(websocket, path):
    """
    Collects audio from the stream, writes it to buffer and return the output of Google speech to text
    """
    transcoder = Transcoder()
    while True:
        if transcoder.closed:
            transcoder.start()
            print("시작")
        try:
            data = await websocket.recv()
        except websockets.ConnectionClosed:
            print("Connection closed")
            break
        transcoder.write(data)
        transcoder.closed = False
        if transcoder.transcript:
            print(transcoder.transcript)
            await websocket.send(transcoder.transcript)
            transcoder.transcript = None

start_server = websockets.serve(audio_processor, IP, PORT)
print("working")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()