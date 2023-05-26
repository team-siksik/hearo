import board,busio
from adafruit_st7735r import ST7735R
import displayio
from adafruit_display_text import label
from adafruit_bitmap_font import bitmap_font
from digitalio import DigitalInOut, Direction
import array
import audiobusio
import scouter
# 코드 작동 시간 출력용
import time

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

splash = displayio.Group()
display.show(splash)

color_bitmap = displayio.Bitmap(160, 128, 1)

color_palette = displayio.Palette(1)
color_palette[0] = 0x00FF00

bg_sprite = displayio.TileGrid(color_bitmap, pixel_shader=color_palette, x=0, y=0)
splash.append(bg_sprite)

inner_bitmap = displayio.Bitmap(150, 118, 1)
inner_palette = displayio.Palette(1)
inner_palette[0] = 0x000000
inner_sprite = displayio.TileGrid(inner_bitmap, pixel_shader=inner_palette, x=5, y=5)
splash.append(inner_sprite)

# loading
def loading(sleep_time):
    loading_page = displayio.OnDiskBitmap(open("resource/loading.bmp", "rb"))
    loading_grid = displayio.TileGrid(loading_page, pixel_shader=loading_page.pixel_shader, x=0, y=0)
    splash.append(loading_grid)
    time.sleep(sleep_time)
    splash.pop(-1)


# 최대 텍스트 개수를 제한하기 위한 변수
max_text_count = 5

# Load font
print("Font time: {:.2f} seconds".format(time.time() - start_time))
font_file = "NotoSans-Medium.bdf"
# korean_words = open("korean.txt", "r").read()
font = bitmap_font.load_font(font_file)
loading(3)
# font.load_glyphs(korean_words)
text_group = displayio.Group(scale=1, x=24, y=11)
splash.append(text_group)

# 장난용
scouter_group = displayio.Group(scale=1, x=70, y=60)
splash.append(scouter_group)
scouter_activate = False

# 터치용
already_pressed = False

# 음량 표시 임계값 설정
threshold = 15000

# 기본 설정들
service = 2
# 텍스트를 저장할 리스트
text_list = []
text_count = 0
# reset the text list and text count

print("start bluetooth")

# print("Font load time: {:.2f} seconds".format(time.time() - start_time))
while True:
    # send data to bluetooth
    # bluetooth.write(b'1')
    # touch sensor change the service
    if touchpad.value and not already_pressed:
        print("pressed")
        service = (service + 1) % 2
        print(service)
        ans = str(service)
        if service == 0:
            bluetooth.write(b'0')
        elif service == 1:
            bluetooth.write(b'1')

        # reset the settings and display
        text_list = []
        text_count = 0
        if text_group:
            text_group.pop()
        if scouter_group:
            scouter_group.pop()
        display.refresh()
        loading(1)
    already_pressed = touchpad.value
    

    # scouter service
    if service == 0:
        if scouter_activate == False:
            target = scouter.get_number()
            for number in range(1000, target, 28):
                label_text = label.Label(font, text=str(number), color=0xFFFFFF)
                if scouter_group:
                    scouter_group.pop()
                scouter_group.append(label_text)
                display.refresh()
                time.sleep(0.01)
            scouter_activate = True

    # sound detect service
    elif service == 1:
        scouter_activate = False
        command = bluetooth.readline()
        # 이후 서비스 실제로 들어오면 데이터 변환하는 코드 작업 필요
        if command is not None:
            detect_text, detect_img = sound_detect(feature)
            print(detect_text)
            if detect_text:
                picture_grid = displayio.TileGrid(detect_img, pixel_shader=detect_img.pixel_shader, x=60, y=20)
                label_text = label.Label(font, text=detect_text, color=yellow)
                splash.append(picture_grid)
                scouter_group.append(label_text)
                scouter_group.x = 64 - len(detect_text) * 3
                time.sleep(4)
                # 디스플레이 업데이트
                display.refresh()
                splash.pop(-1)
                scouter_group.pop()


    time.sleep(0.01)

