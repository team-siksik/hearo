import pyaudio
from pyannote.audio.core.io import Microphone
from pyannote.audio.applications import SpeakerDiarization
from pyannote.core import Annotation
import logging

# Initialize speaker diarization model
diarization = SpeakerDiarization.from_pretrained()

# Initialize microphone input
microphone = Microphone(sample_rate=16000)

# Initialize annotation for storing speaker turns
current_annotation = Annotation()

# Start the microphone
with microphone:
    for chunk in microphone:
        # Perform speaker diarization on current chunk of audio
        current_annotation = diarization(current_annotation, chunk)
        
        # Print current speaker turns
        print(current_annotation)
