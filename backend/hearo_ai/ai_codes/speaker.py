from diart import OnlineSpeakerDiarization
from diart.sources import MicrophoneAudioSource
from diart.inference import RealTimeInference
from diart.sinks import RTTMWriter

class PrintResultObserver:
    def on_next(self, result):
        print(result)
    def on_error(self, error: Exception):
        self.patch()
    def on_completed(self):
        self.patch()


pipeline = OnlineSpeakerDiarization()
mic = MicrophoneAudioSource(pipeline.config.sample_rate)
inference = RealTimeInference(pipeline, mic, do_plot=True)
inference.attach_observers(PrintResultObserver())
print("Starting inference...")
prediction = inference()