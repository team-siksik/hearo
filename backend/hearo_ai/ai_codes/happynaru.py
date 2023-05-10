import logging
from diart.sources import MicrophoneAudioSource
from diart.inference import RealTimeInference
from diart.sinks import RTTMWriter
from diart import OnlineSpeakerDiarization
from pyannote.core import Segment


# 로그 생성
logger = logging.getLogger()

# 로그의 출력 기준 설정
logger.setLevel(logging.INFO)

# log 출력 형식
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

import os
import rx.operators as ops
import diart.operators as dops
from diart.sources import MicrophoneAudioSource
from diart import PipelineConfig
import numpy as np
from pyannote.core import Annotation, SlidingWindowFeature, SlidingWindow
import speech_recognition as sr

class STT:
    def __init__(self):
        self.r = sr.Recognizer()

    def transcribe_audio_stream(self, audio_stream):
        text = ""
        print(type(audio_stream))
        try:
            text = self.r.recognize_google(audio_stream, language='ko-KR')
            print(text)
        except sr.UnknownValueError as e:
            print("Error:", str(e))
        except sr.RequestError as e:
            print("Error:", str(e))
        return text

    def identify_speakers(self, transcription, diarization, time_shift):
        """Iterate over transcription segments to assign speakers"""
        speaker_captions = []
        for segment in transcription["segments"]:

            # Crop diarization to the segment timestamps
            start = time_shift + segment["words"][0]["start"]
            end = time_shift + segment["words"][-1]["end"]
            dia = diarization.crop(Segment(start, end))

            # Assign a speaker to the segment based on diarization
            speakers = dia.labels()
            num_speakers = len(speakers)
            if num_speakers == 0:
                # No speakers were detected
                caption = (-1, segment["text"])
            elif num_speakers == 1:
                # Only one speaker is active in this segment
                spk_id = int(speakers[0].split("speaker")[1])
                caption = (spk_id, segment["text"])
            else:
                # Multiple speakers, select the one that speaks the most
                max_speaker = int(np.argmax([
                    dia.label_duration(spk) for spk in speakers
                ]))
                caption = (max_speaker, segment["text"])
            speaker_captions.append(caption)

        return speaker_captions

    def __call__(self, diarization, waveform):
        # Step 1: Transcribe
        transcription = self.transcribe_audio_stream(waveform)
        # Update transcription buffer
        self._buffer += transcription["text"]
        # The audio may not be the beginning of the conversation
        time_shift = waveform.sliding_window.start
        # Step 2: Assign speakers
        speaker_transcriptions = self.identify_speakers(transcription, diarization, time_shift)
        return speaker_transcriptions

# 색 입히기
def colorize_transcription(transcription):
    """
    Unify a speaker-aware transcription represented as
    a list of `(speaker: int, text: str)` pairs
    into a single text colored by speakers.
    """
    colors = 2 * [
        "bright_red", "bright_blue", "bright_green", "orange3", "deep_pink1",
        "yellow2", "magenta", "cyan", "bright_magenta", "dodger_blue2"
    ]
    result = []
    for speaker, text in transcription:
        if speaker == -1:
            # No speakerfound for this text, use default terminal color
            result.append(text)
        else:
            result.append(f"[{colors[speaker]}]{text}")
    return "\n".join(result)

# 합치기...
def concat(chunks, collar=0.1):
    """
    Concatenate predictions and audio
    given a list of `(diarization, waveform)` pairs
    and merge contiguous single-speaker regions
    with pauses shorter than `collar` seconds.
    """
    first_annotation = chunks[0][0]
    first_waveform = chunks[0][1]
    annotation = Annotation(uri=first_annotation.uri)
    data = []
    for ann, wav in chunks:
        annotation.update(ann)
        data.append(wav.data)
    annotation = annotation.support(collar)
    window = SlidingWindow(
        first_waveform.sliding_window.duration,
        first_waveform.sliding_window.step,
        first_waveform.sliding_window.start,
    )
    data = np.concatenate(data, axis=0)
    return annotation, SlidingWindowFeature(data, window)


config = PipelineConfig()
# add speechrecognition on diart pipeline
dia = OnlineSpeakerDiarization()
source = MicrophoneAudioSource(config.sample_rate)
asr = STT()
import traceback
import rich
import rx.operators as ops
import diart.operators as dops

# Split the stream into 1s chunks for transcription
transcription_duration = 1
# Apply models in batches for better efficiency
batch_size = int(transcription_duration // config.step)

# Chain of operations to apply on the stream of microphone audio
source.stream.pipe(
    # Format audio stream to sliding windows of 5s with a step of 500ms
    dops.rearrange_audio_stream(
        config.duration, config.step, config.sample_rate
    ),
    # Wait until a batch is full
    # The output is a list of audio chunks
    ops.buffer_with_count(count=batch_size),
    # Obtain diarization prediction
    # The output is a list of pairs `(diarization, audio chunk)`
    ops.map(dia),
    # Concatenate 500ms predictions/chunks to form a single 2s chunk
    ops.map(concat),
    # Ignore this chunk if it does not contain speech
    ops.filter(lambda ann_wav: ann_wav[0].get_timeline().duration() > 0),
    # Obtain speaker-aware transcriptions
    # The output is a list of pairs `(speaker: int, caption: str)`
    ops.starmap(asr),
    # Color transcriptions according to the speaker
    # The output is plain text with color references for rich
    ops.map(colorize_transcription),
).subscribe(
    on_next=rich.print,  # print colored text
    on_error=lambda _: traceback.print_exc()  # print stacktrace if error
)



print("Listening...")
source.read()

