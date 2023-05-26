import array
import audiobusio
import board
import time

# 마이크 핀 설정
mic_data_pin = board.GP21
mic_clock_pin = board.GP2

# 오디오 입력 설정
mic = audiobusio.PDMIn(
    data_pin=mic_data_pin,
    clock_pin=mic_clock_pin,
    sample_rate=16000,  # 샘플링 속도 설정 (예: 16000 Hz)
    bit_depth=16  # 비트 깊이 설정 (예: 16-bit)
)

# 음량 표시 임계값 설정
threshold = 15000

while True:
    # 오디오 샘플 읽기
    samples = array.array('H', [0] * 160)
    mic.record(samples, len(samples))

    # 음량 확인
    volume = sum(samples) // len(samples)

    # 음량에 따른 동작 수행
    if volume > threshold:
        current_time = time.monotonic()  # 현재 시간 얻기
        print("음성 감지됨 - 시간:", current_time)
        # 여기에 원하는 동작을 추가하거나 처리할 수 있습니다.

    # 잠시 대기
    time.sleep(0.1)
