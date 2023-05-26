# 수신하는 모든 코드를 담고 있는 파일
import asyncio
import displayio
from sound_detect import sound_detect
from adafruit_display_text import label
from adafruit_bitmap_font import bitmap_font
import scouter
# color

white = 0x000000
green = 0x00FF00
black = 0x000000# 수신하는 모든 코드를 담고 있는 파일
import asyncio
import displayio
from sound_detect import sound_detect
from adafruit_display_text import label
from adafruit_bitmap_font import bitmap_font
import scouter
# color

white = 0x000000
green = 0x00FF00
black = 0x000000
yellow = 0xFFFF00

class DisplayController:
    def __init__(self, display, bluetooth):
        self.bluetooth = bluetooth
        self.display = display
        self.splash = displayio.Group()
        self.display.show(self.splash)
        color_bitmap = displayio.Bitmap(160, 128, 1)
        self.font = bitmap_font.load_font("NotoSans-Medium_10.pcf")

        color_palette = displayio.Palette(1)
        color_palette[0] = black
    
        bg_sprite = displayio.TileGrid(color_bitmap, pixel_shader=color_palette, x=0, y=0)
        self.splash.append(bg_sprite)

        inner_bitmap = displayio.Bitmap(150, 118, 1)
        inner_palette = displayio.Palette(1)
        inner_palette[0] = black
        self.inner_sprite = displayio.TileGrid(inner_bitmap, pixel_shader=inner_palette, x=5, y=5)
        self.splash.append(self.inner_sprite)

        self.text_group = displayio.Group(scale=1, x=10, y=11)
        self.splash.append(self.text_group)
        for i in range(5):
            text_area = label.Label(
                        self.font,
                        text=" "*25,
                        color=yellow
                        )
            text_area.y = i*20 + 11 
            self.text_group.append(text_area)

        self.scouter_group = displayio.Group(scale=2, x=60, y=60)
        self.splash.append(self.scouter_group)
        
        # stt mode
        self.text_list = []
        self.text_count = 0
        self.max_text_count = 5
        # scouter mode
        self.scouter_active = False

    async def update_display(self, service):
        text = self.bluetooth.readline()
        if text is not None:
            print(text)
            # 주변 소음 인식
            if service == 0:
                detect_text, detect_img = await sound_detect(text)
                if detect_img is not False:
                    picture_grid = displayio.TileGrid(detect_img, pixel_shader=detect_img.pixel_shader, x=60, y=20)
                    label_text = label.Label(self.font, text=detect_text, color=yellow)
                    self.splash.append(picture_grid)
                    self.scouter_group.append(label_text)
                    self.scouter_group.y = 90
                    self.scouter_group.x = 64 - len(detect_text) * 3
                    await asyncio.sleep(4)
                    # 디스플레이 업데이트
                    self.display.refresh()
                    self.splash.pop(-1)
                    self.scouter_group.pop()
            # stt
            elif service == 1:
                speech_text = str(text.decode())
                before_position = self.text_count
                segment_length = 18
                new_lines = 0
                for j in range(0, len(speech_text), segment_length):
                    self.text_list.append(speech_text[j:j + segment_length])
                    self.text_count += 1
                    new_lines += 1
                while self.max_text_count < self.text_count:
                    self.text_list.pop(0)
                    self.text_count -= 1

                slice_position = self.text_count - new_lines
                for idx, text in enumerate(self.text_list[:slice_position]):
                    self.text_group[idx].text = " "*25
                    self.text_group[idx].text = text
                for idx, line in enumerate(self.text_list[slice_position:], start=slice_position):
                    self.text_group[idx].text = " "*25
                    for char in line:
                        self.text_group[idx].text = self.text_group[idx].text + char if self.text_group[idx].text != " "*25 else char
                        await asyncio.sleep(0.1)
                    
        # scouter
        if service == 2:
            if self.scouter_active == False:
                target = scouter.get_number()
                self.scouter_group.y = 60
                self.scouter_group.x = 50
                for number in range(1000, target, 28):
                    label_text = label.Label(self.font, text=str(number), color=0xFFFF00)
                    if self.scouter_group:
                        self.scouter_group.pop()
                    self.scouter_group.append(label_text)
                    self.display.refresh()
                    await asyncio.sleep(0.01)
                self.scouter_active = True
        return True
    
    def refresh(self):
        if self.text_group:
            for line in self.text_group:
                line.text = " "*20
        if self.scouter_group:
            self.scouter_group.pop()
            self.scouter_group.y = 60
        self.scouter_active = False
        self.text_list = []
        self.text_count = 0
            


yellow = 0xFFFF00

class DisplayController:
    def __init__(self, display, bluetooth):
        self.bluetooth = bluetooth
        self.display = display
        self.splash = displayio.Group()
        self.display.show(self.splash)
        color_bitmap = displayio.Bitmap(160, 128, 1)

        color_palette = displayio.Palette(1)
        color_palette[0] = black
    
        bg_sprite = displayio.TileGrid(color_bitmap, pixel_shader=color_palette, x=0, y=0)
        self.splash.append(bg_sprite)

        inner_bitmap = displayio.Bitmap(150, 118, 1)
        inner_palette = displayio.Palette(1)
        inner_palette[0] = black
        self.inner_sprite = displayio.TileGrid(inner_bitmap, pixel_shader=inner_palette, x=5, y=5)
        self.splash.append(self.inner_sprite)

        self.text_group = displayio.Group(scale=2, x=10, y=11)
        self.splash.append(self.text_group)

        self.scouter_group = displayio.Group(scale=3, x=60, y=60)
        self.splash.append(self.scouter_group)
        self.font = bitmap_font.load_font("NotoSans-Medium_6.bdf")
        
        # stt mode
        self.text_list = []
        self.text_count = 0
        self.max_text_count = 5
        # scouter mode
        self.scouter_active = False

    async def update_display(self, service):
        text = self.bluetooth.readline()
        print(text)
        if text is not None:
            # 주변 소음 인식
            if service == 0:
                detect_text, detect_img = await sound_detect(text)
                if detect_img is not False:
                    picture_grid = displayio.TileGrid(detect_img, pixel_shader=detect_img.pixel_shader, x=60, y=20)
                    label_text = label.Label(self.font, text=detect_text, color=yellow)
                    self.splash.append(picture_grid)
                    self.scouter_group.append(label_text)
                    self.scouter_group.y = 90
                    self.scouter_group.x = 64 - len(detect_text) * 3
                    await asyncio.sleep(4)
                    # 디스플레이 업데이트
                    self.display.refresh()
                    self.splash.pop(-1)
                    self.scouter_group.pop()
            # stt
            elif service == 1:
                speech_text = str(text.decode())
                for j in range(0,len(speech_text),10):
                    self.text_list.append(speech_text[j:j+10])
                    self.text_count += 1
                while self.max_text_count < self.text_count:
                    self.text_list.pop(0)
                    self.text_count -= 1
                full_text = ""
                for text in self.text_list[:-1]:
                    full_text += text + "\n"
                for char in self.text_list[-1]:
                    full_text += char
                    text_area = label.Label(
                    self.font,
                    text=full_text,
                    color=yellow
                    )
                    if self.text_group:
                        self.text_group.pop()
                    self.text_group.append(text_area)
                    await asyncio.sleep(0.1)
        # scouter
        if service == 2:
            if self.scouter_active == False:
                target = scouter.get_number()
                self.scouter_group.y = 60
                self.scouter_group.x = 50
                for number in range(1000, target, 28):
                    label_text = label.Label(self.font, text=str(number), color=0xFFFF00)
                    if self.scouter_group:
                        self.scouter_group.pop()
                    self.scouter_group.append(label_text)
                    self.display.refresh()
                    await asyncio.sleep(0.01)
                self.scouter_active = True
        return True
    
    def refresh(self):
        if self.text_group:
            self.text_group.pop()
        if self.scouter_group:
            self.scouter_group.pop()
            self.scouter_group.y = 60
        self.scouter_active = False
        self.text_list = []
        self.text_count = 0
            
