
import re
import sys
import time

from google.cloud import speech
from google.cloud.speech import enums, types
import pyaudio
from six.moves import queue
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Coding/S08P31A603/backend/hearo_ai/credential.json"
# Audio recording parameters
STREAMING_LIMIT = 240000  # 4 minutes
SAMPLE_RATE = 16000
CHUNK_SIZE = int(SAMPLE_RATE / 10)  # 100ms

RED = "\033[0;31m"
GREEN = "\033[0;32m"
YELLOW = "\033[0;33m"

def get_current_time():
    """Return Current Time in MS."""

    return int(round(time.time() * 1000))

def send_audio_data(data):
    # Encode audio data as base64 and emit it to the server
    audio_base64 = base64.b64encode(data).decode('utf-8')
    sio.emit('audio_data', audio_base64)
class AudioCapture(object):
    """Captures audio from the microphone and sends it via socket.io"""

    def __init__(self, rate, chunk):
        self._rate = rate
        self._chunk = chunk
        self._pa = None
        self._stream = None

    def __enter__(self):
        self._pa = pyaudio.PyAudio()
        self._stream = self._pa.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=self._rate,
            input=True,
            frames_per_buffer=self._chunk,
            stream_callback=self._callback
        )
        return self

    def __exit__(self, type, value, traceback):
        self._stream.stop_stream()
        self._stream.close()
        self._pa.terminate()

    def _callback(self, in_data, frame_count, time_info, status_flags):
        send_audio_data(in_data)
        return None, pyaudio.paContinue

def listen_print_loop(responses, stream):
    """Iterates through server responses and prints them.

    The responses passed is a generator that will block until a response
    is provided by the server.

    Each response may contain multiple results, and each result may contain
    multiple alternatives; for details, see https://goo.gl/tjCPAU.  Here we
    print only the transcription for the top alternative of the top result.

    In this case, responses are provided for interim results as well. If the
    response is an interim one, print a line feed at the end of it, to allow
    the next result to overwrite it, until the response is a final one. For the
    final one, print a newline to preserve the finalized transcription.
    """

    for response in responses:

        if get_current_time() - stream.start_time > STREAMING_LIMIT:
            stream.start_time = get_current_time()
            break

        if not response.results:
            continue

        result = response.results[0]

        if not result.alternatives:
            continue

        transcript = result.alternatives[0].transcript

        result_seconds = 0
        result_micros = 0

        # if result.result_end_time.seconds:
        #     result_seconds = result.result_end_time.seconds

        # if result.result_end_time.microseconds:
        #     result_micros = result.result_end_time.microseconds

        stream.result_end_time = int((result_seconds * 1000) + (result_micros / 1000))

        corrected_time = (
            stream.result_end_time
            - stream.bridging_offset
            + (STREAMING_LIMIT * stream.restart_counter)
        )
        # Display interim results, but with a carriage return at the end of the
        # line, so subsequent lines will overwrite them.

        if result.is_final:

            sys.stdout.write(GREEN)
            sys.stdout.write("\033[K")
            sys.stdout.write(str(corrected_time) + ": " + transcript + "\n")

            stream.is_final_end_time = stream.result_end_time
            stream.last_transcript_was_final = True

            # Exit recognition if any of the transcribed phrases could be
            # one of our keywords.
            if re.search(r"\b(그만|중지)\b", transcript, re.I):
                sys.stdout.write(YELLOW)
                sys.stdout.write("Exiting...\n")
                stream.closed = True
                break

        else:
            sys.stdout.write(RED)
            sys.stdout.write("\033[K")
            sys.stdout.write(str(corrected_time) + ": " + transcript + "\r")

            stream.last_transcript_was_final = False

def main():
    """start bidirectional streaming from microphone input to speech API"""
    client = speech.SpeechClient()
    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=SAMPLE_RATE,
        language_code="ko-KR",
        max_alternatives=1
    )
    streaming_config = types.StreamingRecognitionConfig(
        config=config, interim_results=True
    )

    mic_manager = ResumableMicrophoneStream(SAMPLE_RATE, CHUNK_SIZE)
    print(mic_manager.chunk_size)
    sys.stdout.write(YELLOW)
    sys.stdout.write('\nListening, say "그만" or "중지" to stop.\n\n')
    sys.stdout.write("End (ms)       Transcript Results/Status\n")
    sys.stdout.write("=====================================================\n")
    
    with AudioCapture(RATE, CHUNK) as audio_capture:
        with mic_manager as stream:
            audio_generator = audio_capture.generator()
            requests = (
                speech.StreamingRecognizeRequest(audio_content=content)
                for content in audio_generator
            )

            responses = client.streaming_recognize(streaming_config, requests)
            listen_print_loop(responses)

        while not stream.closed:
            sys.stdout.write(YELLOW)
            sys.stdout.write(
                "\n" + str(STREAMING_LIMIT * stream.restart_counter) + ": NEW REQUEST\n"
            )

            stream.audio_input = []
            audio_generator = stream.generator()

            requests = (
                types.StreamingRecognizeRequest(audio_content=content)
                for content in audio_generator
            )

            responses = client.streaming_recognize(streaming_config, requests)

            # Now, put the transcription responses to use.
            listen_print_loop(responses, stream)

            if stream.result_end_time > 0:
                stream.final_request_end_time = stream.is_final_end_time
            stream.result_end_time = 0
            stream.last_audio_input = []
            stream.last_audio_input = stream.audio_input
            stream.audio_input = []
            stream.restart_counter = stream.restart_counter + 1

            if not stream.last_transcript_was_final:
                sys.stdout.write("\n")
            stream.new_stream = True

if __name__ == "__main__":

    main()