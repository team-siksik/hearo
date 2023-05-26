from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
from oled import Write, GFX, SSD1306_I2C
from oled.fonts import ubuntu_mono_15, ubuntu_mono_20
import time
led = Pin(25, Pin.OUT)
WIDTH =128
HEIGHT = 64
i2c=I2C(0,scl=Pin(5), sda=Pin(4),freq=200000)
oled=SSD1306_I2C(WIDTH,HEIGHT,i2c)
write15=Write(oled,ubuntu_mono_15)
write20=Write(oled,ubuntu_mono_20)
write20.text("안녕하세요",0,0)
write15.text("DISPLAY",0,20)
oled.text("ElectronicDevice",0,40)
oled.show()

from machine import Pin, UART
uart = UART(0, 9600)

print('start pico bluetooth test')
led = Pin(25, Pin.OUT)
while True:
    led.high()
    time.sleep(1)
    led.low()
    time.sleep(1)
    if uart.any():
        command = uart.readline()
        print(command)   # uncomment this line to see the recieved data
        if command==b'1':
            led.high()
            print("ON")
            write20.text("On",0,0)
            oled.show()
        elif command==b'0':
            led.low()
            print("OFF")
            write20.text("Off",0,0)
            oled.show()
