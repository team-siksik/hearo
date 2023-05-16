import array
import time
class BluetoothTransmitter:
    def __init__(self, bluetooth, mic, camera) -> None:
        self.bluetooth = bluetooth
        self.mic = mic
        self.camera = camera
        # 음량 임계값 설정
        self.threshold = 10000
        self.samples = array.array('H', [0] * 160)
    
    async def data_transmit(self, service):
        if service == 0 or service == 1:
            self.mic.record(self.samples, len(self.samples))
            volume = sum(self.samples) // len(self.samples)
            if volume > self.threshold:
                print("음성 감지됨 - 시간:", time.monotonic())
                self.bluetooth.write(bytes(self.samples))

        elif service == 2:
            print("doing nohing")
            self.bluetooth.write(bytes(self.samples))
        return True
            
    def refresh(self):
        self.samples = array.array('H', [0] * 160)

