from diart import OnlineSpeakerDiarization
from diart.sources import WebSocketAudioSource
from diart.inference import RealTimeInference
from typing import Union, Text, Tuple
from pyannote.core import Annotation
import logging

# 로그 생성
logger = logging.getLogger()

# 로그의 출력 기준 설정
logger.setLevel(logging.INFO)

# log 출력 형식
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
print("시작함")

def _extract_annotation(value: Union[Tuple, Annotation]) -> Annotation:
    if isinstance(value, tuple):
        return value[0]
    if isinstance(value, Annotation):
        return value
    msg = f"Expected tuple or Annotation, but got {type(value)}"
    raise ValueError(msg)

class PrintResultObserver:
    def __init__(self, uri: Text,source, patch_collar: float = 0.05):
        super().__init__()
        self.uri = uri
        self.patch_collar = patch_collar
        self.source = source

    def on_next(self, value: Union[Tuple, Annotation]):
        annotation = _extract_annotation(value)
        # speakerinfo = list(annotation.split())
        print(annotation.__str__())
        speakerinfo = list(annotation.__str__().split())
        print("화자 번호", speakerinfo[4] if speakerinfo else "None")
        self.source.send(speakerinfo[4] if speakerinfo else "None")

    def on_error(self, error: Exception):
        logging.info(f"error {error}")
        self.patch()

    def on_completed(self):
        self.patch()

    def patch(self):
        return
    
pipeline = OnlineSpeakerDiarization()
source = WebSocketAudioSource(pipeline.config.sample_rate, "localhost", 8000)
inference = RealTimeInference(pipeline, source)
inference.attach_observers(PrintResultObserver(source.uri, source))
# inference.attach_hooks(lambda ann_wav: source.send(ann_wav[0].to_rttm()))
prediction = inference()