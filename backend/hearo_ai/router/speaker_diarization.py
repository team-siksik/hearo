from fastapi import APIRouter
from main import socket_manager, logger
from google.cloud import speech
from collections import deque
from six.moves import queue
import threading
import re
import os

logger.info(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
router = APIRouter(prefix="/sd")

# 버퍼 크기 (1초에 해당하는 샘플 수)
RATE=16000
BUFFER_SIZE = RATE  # 예시로 버퍼 크기를 RATE로 설정했습니다.
# 음성 데이터를 저장하는 버퍼
audio_buffer = deque(maxlen=BUFFER_SIZE)

@router.get("/test")
async def root():

    logger.info("root: sd router api 호출")
    return {"message": "hearo!"}
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
        logger.info(f"init {self.language}, {self.rate}")

    def start(self):
        """Start up streaming speech call"""
        logger.info("restart")
        self.closed = False
        threading.Thread(target=self.process).start()

    def ending(self):
        self.closed = True

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
                logger.info(f"stt result not final {transcript + overwrite_chars}")
                num_chars_printed = len(transcript)

            else:
                logger.info(f"stt result final {transcript + overwrite_chars}")
                self.final = True

                # Exit recognition if any of the transcribed phrases could be
                # one of our keywords.
                if re.search(r"\b(그만|중지)\b", transcript, re.I):
                    logger.info("Exiting..")
                    break
                num_chars_printed = 0

    def process(self):
        """
        Audio stream recognition and result parsing
        """
        try:
            # Create a Speech client
            client = speech.SpeechClient()

            # Configure recognition settings
            config = speech.RecognitionConfig(
                encoding=self.encoding,
                sample_rate_hertz=self.rate,
                language_code=self.language,
            )
            streaming_config = speech.StreamingRecognitionConfig(
                config=config,
                interim_results=True
            )

            # Generate audio content for streaming requests
            audio_generator = self.stream_generator()
            requests = (speech.StreamingRecognizeRequest(audio_content=content)
                        for content in audio_generator)

            # Perform streaming recognition
            responses = client.streaming_recognize(streaming_config, requests)
            logger.info(responses)

            # Process the responses
            self.response_loop(responses)

        except Exception as e:
            logger.error("An error occurred during speech processing: %s", e)
            # Perform error handling or recovery actions here

    def stream_generator(self):
        logger.info(f"start stream_generator {self.closed}")
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

transcoder_cache = {}

@socket_manager.on("audio")
async def audio(sid, data):
    if sid in transcoder_cache:
        transcoder = transcoder_cache[sid]
    else:
        transcoder = Transcoder(rate=RATE, language="ko-KR", encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16)
        transcoder.start()
        transcoder_cache[sid] = transcoder
        logger.info(f"Transcoder started for room {sid}")

    logger.info("audio: sd router api 호출")
    logger.info(type(data))
    transcoder.write(data)
    # print(transcoder.transcript)
    if transcoder.transcript:
        logger.info(transcoder.transcript)
        sending = {"final" : transcoder.final, "transcript" : transcoder.transcript}
        transcoder.transcript = None
    else:
        sending = {"final" : transcoder.final, "transcript" : "nothing"}
    await socket_manager.emit("data", sending)