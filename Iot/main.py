# 수신하는 모든 코드를 담고 있는 파일

import board, busio
from adafruit_st7735r import ST7735R
import displayio
from adafruit_bitmap_font import bitmap_font
from digitalio import DigitalInOut, Direction
import audiobusio
import asyncio
# 코드 작동 시간 출력용
import time
from sound_detect import sound_detect

# 비동기 함수
from DisplayController import DisplayController
from BluetoothTransmitter import BluetoothTransmitter
# 로그용 현재 시간
start_time = time.time()

# 핀 및 기본 정보
# bluetooth
bluetooth = busio.UART(board.GP0, board.GP1, baudrate=9600)
# display
mosi_pin = board.GP11
clk_pin = board.GP10
reset_pin = board.GP17
cs_pin = board.GP18
dc_pin = board.GP16
# gp8 gp16 간 호환 가능(이후 카메라및 디스플레이 간 변경 요구)

# touchpad
touch_pin = board.GP26
touchpad = DigitalInOut(touch_pin)
touchpad.direction = Direction.INPUT

# led
led = DigitalInOut(board.LED)
led.direction = Direction.OUTPUT

#display
displayio.release_displays()
spi = busio.SPI(clock=clk_pin, MOSI=mosi_pin)
display_bus = displayio.FourWire(spi, command=dc_pin, chip_select=cs_pin, reset=reset_pin)
display = ST7735R(display_bus, width=128, height=160, bgr = True)
display.rotation = 90

output = DisplayController(display, bluetooth)

# 마이크 핀 설정
mic_data_pin = board.GP21
mic_clock_pin = board.GP2
# 오디오 입력 설정
mic = audiobusio.PDMIn(
    data_pin=mic_data_pin,
    clock_pin=mic_clock_pin,
    sample_rate=32000 ,  # 샘플링 속도 설정 (예: 16000 Hz)
    bit_depth=16  # 비트 깊이 설정 (예: 16-bit)
)
# 카메라
camera = "camera"

trasmitter = BluetoothTransmitter(bluetooth, mic, camera)

# loading
def loading(sleep_time):
    loading_page = displayio.OnDiskBitmap(open("resource/loading.bmp", "rb"))
    loading_grid = displayio.TileGrid(loading_page, pixel_shader=loading_page.pixel_shader, x=0, y=0)
    output.splash.append(loading_grid)
    time.sleep(sleep_time)

# Load font
print("Font time: {:.2f} seconds".format(time.time() - start_time))
font_file = "NotoSans-Medium_6.bdf"
korean_words = open("korean.txt", "r").read()
font = bitmap_font.load_font(font_file)
loading(3)
# loading_font
async def loading_font():
    print("Font time: {:.2f} seconds".format(time.time() - start_time))
    for i in range(0, len(korean_words), 100):
        print("Font{} time: {:.2f} seconds".format(i, time.time() - start_time))
        font.load_glyphs(korean_words[i:i+100])
        print("Font{} time: {:.2f} seconds".format(i, time.time() - start_time))
    return 0

print("start bluetooth")
output.splash.pop(-1)
print("Font load time: {:.2f} seconds".format(time.time() - start_time))
async def main():
    service = 0
    already_pressed = False
    await loading_font()
    while True:
        # touch sensor change the service
        if touchpad.value and not already_pressed:
            already_pressed = touchpad.value
            print("pressed")
            time.sleep(0.01)
            if touchpad.value and already_pressed:
                print("pressed")
                service = (service + 1) % 3
                print(service)
                if service == 0:
                    bluetooth.write(b"0")
                elif service == 1:
                    bluetooth.write(b"1")
                elif service == 2:
                    bluetooth.write(b"2")
                # reset the settings and display
                output.refresh()
                trasmitter.refresh()
                loading(1)
                output.splash.pop(-1)
                print("서비스 변경 - 시간:", "current_time")
        already_pressed = touchpad.value
        
        await asyncio.gather(
            output.update_display(service),
            trasmitter.data_transmit(service)
        )

        time.sleep(0.01)
asyncio.run(main())
