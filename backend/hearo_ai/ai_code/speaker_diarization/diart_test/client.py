from queue import SimpleQueue
from typing import Text, Optional, Union, Tuple
from pathlib import Path
from threading import Thread
from websocket import WebSocket
from rx.subject import Subject

import base64
import numpy as np
import sounddevice as sd
import rx.operators as ops


class MicrophoneAudioSource:

    def __init__(self,
                 sample_rate: int,
                 block_size: int = 1000,
                 device: Optional[Union[int, Text, Tuple[int, Text]]] = None):
        self.uri = "live recording"
        self.sample_rate = sample_rate
        self.stream = Subject()
        self.block_size = block_size
        self._mic_stream = sd.InputStream(
            channels=1,
            samplerate=sample_rate,
            latency=0,
            blocksize=self.block_size,
            callback=self._read_callback,
            device=device,
        )
        self._queue = SimpleQueue()

    @property
    def duration(self) -> Optional[float]:
        """The duration of the stream if known. Defaults to None (unknown duration)."""
        return None

    def _read_callback(self, samples, *args):
        self._queue.put_nowait(samples[:, [0]].T)

    def read(self):
        self._mic_stream.start()
        while self._mic_stream:
            try:
                while self._queue.empty():
                    if self._mic_stream.closed:
                        break
                self.stream.on_next(self._queue.get_nowait())
            except BaseException as e:
                self.stream.on_error(e)
                break
        self.stream.on_completed()
        self.close()

    def close(self):
        self._mic_stream.stop()
        self._mic_stream.close()


def encode_audio(waveform: np.ndarray) -> Text:
    data = waveform.astype(np.float32).tobytes()
    return base64.b64encode(data).decode("utf-8")


def send_audio(ws: WebSocket, source: Text, step: float, sample_rate: int):
    # Create audio source
    block_size = int(np.rint(step * sample_rate))
    source = MicrophoneAudioSource()
    audio_source = source(sample_rate, block_size)

    # Encode audio, then send through websocket
    audio_source.stream.pipe(
        ops.map(encode_audio)
    ).subscribe_(ws.send)

    # Start reading audio
    audio_source.read()


def receive_audio(ws: WebSocket, output: Optional[Path]):
    while True:
        message = ws.recv()
        print(f"Received: {message}", end="")
        if output is not None:
            with open(output, "a") as file:
                file.write(message)


ws = WebSocket()
ws.connect("ws://k8a6031.p.ssafy.io:7007/")
sender = Thread(target=send_audio, args=[ws, 'microphone', 0.5, 16000])
receiver = Thread(target=receive_audio, args=[ws])
sender.start()
receiver.start()
