import framebuf
import st7735
from machine import SPI, Pin

# SPI 설정
spi = SPI(0, baudrate=20000000, sck=Pin(2), mosi=Pin(3))
cs = Pin(5)
dc = Pin(6)
rst = Pin(7)
display = st7735.ST7735(spi, cs, dc, rst)

# 한글 폰트 파일 로드
f = open('korean_font.fnt', 'rb')
font = framebuf.FrameBuffer(f.read(), 16, 16, framebuf.MVLSB)

# 한글 출력 함수
def draw_korean(x, y, text):
    for c in text:
        if ord('가') <= ord(c) <= ord('힣'):
            offset = (ord(c) - 0xAC00) * 28
            font.seek(offset)
            display.blit(font, x, y)
            x += 16
        else:
            x += 8

# 한글 출력
display.fill(0)
draw_korean(0, 0, "안녕하세요!")
display.show()