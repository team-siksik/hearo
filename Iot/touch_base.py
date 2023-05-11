import board,busio
from adafruit_st7735r import ST7735R
import displayio
from adafruit_display_text import label
from adafruit_bitmap_font import bitmap_font
from digitalio import DigitalInOut, Direction
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

color_bitmap = displayio.Bitmap(128, 160, 1)

color_palette = displayio.Palette(1)
color_palette[0] = 0x00FF00

bg_sprite = displayio.TileGrid(color_bitmap, pixel_shader=color_palette, x=0, y=0)
splash.append(bg_sprite)

inner_bitmap = displayio.Bitmap(118, 150, 1)
inner_palette = displayio.Palette(1)
inner_palette[0] = 0x000000
inner_sprite = displayio.TileGrid(inner_bitmap, pixel_shader=inner_palette, x=5, y=5)
splash.append(inner_sprite)

# 최대 텍스트 개수를 제한하기 위한 변수
max_text_count = 5
text_count = 0

# 텍스트를 저장할 리스트
text_list = []

# Load font
print("Font time: {:.2f} seconds".format(time.time() - start_time))
font_file = "NotoSans-Medium.bdf"
korean_words = open("korean.txt", "r").read()
font = bitmap_font.load_font(font_file)
# font.load_glyphs(korean_words)
text_group = displayio.Group(scale=1, x=11, y=24)
splash.append(text_group)

# 장난용
scouter_group = displayio.Group(scale=1, x=60, y=70)
splash.append(scouter_group)

# 터치용
already_pressed = False
service = 2

print("start bluetooth")

print("Font load time: {:.2f} seconds".format(time.time() - start_time))
while True:
    # send data to bluetooth
    bluetooth.write(b'1')
    # touch sensor change the service
    if touchpad.value and not already_pressed:
        print("pressed")
        service = (service + 1) % 3
    if service == 0:
        led.value = True
        command = bluetooth.readline()
    # print(command)   # uncomment this line to see the received data
        if command is not None:
            print(command)
            if scouter_group:
                scouter_group.pop()
            if command == b'1':
                led.value = True
            elif command == b'0':
                led.value = False
    elif service == 1:
        target = scouter.get_number()
        if text_group:
            text_group.pop()
        for number in range(1000, target, 28):
            label_text = label.Label(font, text=str(number), color=0xFFFFFF)
            if scouter_group:
                scouter_group.pop()
            scouter_group.append(label_text)
            display.refresh()
            time.sleep(0.01)
    elif service == 2:
        command = bluetooth.readline()
        # 이후 서비스 실제로 들어오면 데이터 변환하는 코드 작업 필요
        if command is not None:
            print(command)
            if scouter_group:
                scouter_group.pop()
            command_str = str(command.decode())
            print(command_str)
            # 문자열 리스트에 추가하여 출력
            text_list.append(command_str)
            text_count += 1
            if text_count > max_text_count:
                text_list.pop(0)
                text_count -= 1
            # 텍스트 리스트를 순회하며 텍스트 그리기
            full_text = ""
            for i, text in enumerate(text_list):
    #             font.load_glyphs(text)
                full_text += text +"\n"
            text_area = label.Label(
                font,
                text=full_text,
                color=0xFFFFFF
            )
            if text_group:
                text_group.pop()
            text_group.append(text_area)
            

            # 디스플레이 업데이트
            display.refresh()

    already_pressed = touchpad.value
