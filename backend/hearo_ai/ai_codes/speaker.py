import logging

# 로그 생성
logger = logging.getLogger()

# 로그의 출력 기준 설정
logger.setLevel(logging.INFO)

# log 출력 형식
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

from diart import OnlineSpeakerDiarization
from diart.sources import MicrophoneAudioSource
from diart.inference import RealTimeInference
from diart.sinks import RTTMWriter
from typing import Union, Text, Tuple
from pyannote.core import Annotation



def _extract_annotation(value: Union[Tuple, Annotation]) -> Annotation:
    if isinstance(value, tuple):
        return value[0]
    if isinstance(value, Annotation):
        return value
    msg = f"Expected tuple or Annotation, but got {type(value)}"
    raise ValueError(msg)


class PrintResultObserver:
    def __init__(self, uri: Text, patch_collar: float = 0.05):
        super().__init__()
        self.uri = uri
        self.patch_collar = patch_collar

    def on_next(self, value: Union[Tuple, Annotation]):
        annotation = _extract_annotation(value)
        # speakerinfo = list(annotation.split())
        print(annotation.__str__())
        speakerinfo = list(annotation.__str__().split())
        print("화자 번호", speakerinfo[4] if speakerinfo else "None")

    def on_error(self, error: Exception):
        logging.info(f"error {error}")
        self.patch()

    def on_completed(self):
        self.patch()

    def patch(self):
        return

pipeline = OnlineSpeakerDiarization()
mic = MicrophoneAudioSource(pipeline.config.sample_rate)
inference = RealTimeInference(pipeline, mic, do_plot=True)
inference.attach_observers(PrintResultObserver(mic.uri))
inference.attach_observers(RTTMWriter(mic.uri, "./file.rttm"))
print("Starting inference...")
prediction = inference()


