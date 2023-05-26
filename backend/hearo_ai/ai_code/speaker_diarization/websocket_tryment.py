import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Coding/S08P31A603/backend/hearo_ai/credential.json"
import asyncio
import sys
import re
import websockets
import json
import threading
from six.moves import queue
from google.cloud import speech
# from google.cloud.speech import types


IP = 'localhost'
PORT = 8000

class Transcoder(object):
    """
    Converts audio chunks to text
    """
    def __init__(self, encoding, rate, language):
        self.buff = queue.Queue()
        self.encoding = encoding
        self.language = language
        self.rate = rate
        self.closed = True
        self.transcript = None
        self.final = False
        print("init", self.language, self.rate)

    def start(self):
        """Start up streaming speech call"""
        print("restart")
        threading.Thread(target=self.process).start()
        self.closed = False

    def response_loop(self, responses):
        num_chars_printed = 0
        for response in responses:
            if not response.results:
                continue

            # The `results` list is consecutive. For streaming, we only care about
            # the first result being considered, since once it's `is_final`, it
            # moves on to considering the next utterance.
            result = response.results[0]
            if not result.alternatives:
                continue

            # Display the transcription of the top alternative.
            transcript = result.alternatives[0].transcript
            self.transcript = transcript

            # Display interim results, but with a carriage return at the end of the
            # line, so subsequent lines will overwrite them.
            #
            # If the previous result was longer than this one, we need to print
            # some extra spaces to overwrite the previous result
            overwrite_chars = " " * (num_chars_printed - len(transcript))

            if not result.is_final:
                sys.stdout.write(transcript + overwrite_chars + "\r")
                sys.stdout.flush()

                num_chars_printed = len(transcript)

            else:
                print(transcript + overwrite_chars)
                self.final = True

                # Exit recognition if any of the transcribed phrases could be
                # one of our keywords.
                if re.search(r"\b(그만|중지)\b", transcript, re.I):
                    print("Exiting..")
                    break

                num_chars_printed = 0

    def process(self):
        """
        Audio stream recognition and result parsing
        """
        #You can add speech contexts for better recognition
        client = speech.SpeechClient()
        config = speech.RecognitionConfig(
            encoding=self.encoding,
            sample_rate_hertz=self.rate,
            language_code=self.language,
        )
        streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=True)
        audio_generator = self.stream_generator()
        requests = (speech.StreamingRecognizeRequest(audio_content=content)
                    for content in audio_generator)

        responses = client.streaming_recognize(streaming_config, requests)
        print(responses)
        try:
            self.response_loop(responses)
        except Exception as e:
            print("error", e)
            self.start()

    def stream_generator(self):
        print("start stream_generator", self.closed)
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
    config = await websocket.recv()
    if not isinstance(config, str):
        print("ERROR, no config")
        return
    config = json.loads(config)
    transcoder = Transcoder(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        rate=config["rate"],
        language=config["language"]
    )
    transcoder.start()
    print("conected")
    while transcoder.closed is False:
        try:
            data = await websocket.recv()
            print(type(data))
        except websockets.ConnectionClosed:
            print("Connection closed")
            transcoder.closed = True
            break
        transcoder.write(data)
        # print(transcoder.transcript)
        if transcoder.transcript:
            print(transcoder.transcript)
            sending = {"final" : transcoder.final, "transcript" : transcoder.transcript}
            transcoder.transcript = None
        else:
            sending = {"final" : transcoder.final, "transcript" : "nothing"}
        await websocket.send(json.dumps(sending))

start_server = websockets.serve(audio_processor, IP, PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()