# 수신하는 모든 코드를 담고 있는 파일

import board, busio
from adafruit_st7735r import ST7735R
import displayio
from adafruit_bitmap_font import bitmap_font
from digitalio import DigitalInOut, Direction
import audiobusio
import asyncio
import time as utime
import usb_cdc
from Arducam import *
from board import *
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

once_number=128
mode = 0
start_capture = 0
stop_flag=0
data_in=0
value_command=0
flag_command=0
buffer=bytearray(once_number)

mycam = ArducamClass(OV2640)
mycam.Camera_Detection()
mycam.Spi_Test()
mycam.Camera_Init()
utime.sleep(1)
mycam.clear_fifo_flag()
mycam.set_format(JPEG)
mycam.Camera_Init()
mycam.set_bit(ARDUCHIP_TIM,VSYNC_LEVEL_MASK)
trasmitter = BluetoothTransmitter(bluetooth, mic, mycam)

# loading
def loading(sleep_time):
    loading_page = displayio.OnDiskBitmap(open("resource/loading.bmp", "rb"))
    loading_grid = displayio.TileGrid(loading_page, pixel_shader=loading_page.pixel_shader, x=0, y=0)
    output.splash.append(loading_grid)
    time.sleep(sleep_time)
# camera capture
def read_fifo_burst():
    print("capture working")
    count=0
    lenght=mycam.read_fifo_length()
    mycam.SPI_CS_LOW()
    mycam.set_fifo_burst()
    while True:
        mycam.spi.readinto(buffer,start=0,end=once_number)
        bluetooth.write(buffer)
        utime.sleep(0.00015)
        count+=once_number
        if count+once_number>lenght:
            count=lenght-count
            mycam.spi.readinto(buffer,start=0,end=count)
            bluetooth.write(buffer)
            mycam.SPI_CS_HIGH()
            mycam.clear_fifo_flag()
            break
# Load font
print("Font time: {:.2f} seconds".format(time.time() - start_time))
font_file = "NotoSans-Medium_10.bdf"
korean_words = open("korean.txt", "r").read()
font = bitmap_font.load_font(font_file)
loading(3)
# loading_font
async def loading_font():
    print("Font time: {:.2f} seconds".format(time.time() - start_time))
    for i in range(0, len(korean_words),5):
        print("Font{} time: {:.2f} seconds".format(i, time.time() - start_time))
        font.load_glyphs(korean_words[i:i+5])
        print("Font{} time: {:.2f} seconds".format(i, time.time() - start_time))
        await asyncio.sleep(0.3)
    return 0

print("start bluetooth")
output.splash.pop(-1)
print("Font load time: {:.2f} seconds".format(time.time() - start_time))
async def main():
    service = 1
    already_pressed = False
#     loading_task = asyncio.create_task(loading_font())
    while True:
#         print("running")
        # touch sensor change the service and camera capture
        if touchpad.value and not already_pressed:
            already_pressed = touchpad.value
            print("pressed1")
            time.sleep(0.5)
            if touchpad.value and already_pressed:
                print("start capturing")
                mycam.flush_fifo();
                mycam.clear_fifo_flag();
                mycam.start_capture();
                if mycam.get_bit(ARDUCHIP_TRIG,CAP_DONE_MASK)!=0:
                    print("working?")
                    read_fifo_burst() 
            else:
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
            trasmitter.data_transmit(service),
        )
asyncio.run(main())
