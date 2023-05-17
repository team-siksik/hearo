import time as utime
import busio
import board
import usb_cdc
from Arducam import *
from board import *
import os

import sdcardio
import storage

from digitalio import DigitalInOut, Direction, Pull

trigger = DigitalInOut(GP14)
trigger.direction = Direction.INPUT
trigger.pull = Pull.UP

path = '/sd/'
filename = 'test'
extension = '.jpg'

def get_filename():
    return path + filename + str(imageCounter) + extension

imageCounter = 0
mode = 0
start_capture = 0
stop_flag=0
once_number=128
value_command=0
flag_command=0
buffer=bytearray(once_number)
isCapturing = False

spi = busio.SPI(GP10, MOSI=GP11, MISO=GP12)
cs = GP13
sd = sdcardio.SDCard(spi, cs)

vfs = storage.VfsFat(sd)
storage.mount(vfs, '/sd')
with open(get_filename(), 'wb'):
    pass

mycam = ArducamClass(OV5642)
mycam.Camera_Detection()
mycam.Spi_Test()
mycam.Camera_Init()
utime.sleep(1)
mycam.set_format(JPEG)
mycam.OV5642_set_JPEG_size(OV5642_1280x960)
        
def get_still(mycam):
    once_number = 128
    buffer=bytearray(once_number)
    count = 0
    finished = 0
    length = mycam.read_fifo_length()
    mycam.SPI_CS_LOW()
    mycam.set_fifo_burst()

    while finished == 0:
        mycam.spi.readinto(buffer, start=0, end=once_number)
        print(str(count) + ' of ' + str(length))
        with open(get_filename(), 'ab') as fj:
            fj.write(buffer)
        count += once_number
        
        if count + once_number > length:
            print(str(count) + ' of ' + str(length))
            count = length - count
            mycam.spi.readinto(buffer, start=0, end=count)
            with open(get_filename(), 'ab') as fj:
                fj.write(buffer)
            mycam.SPI_CS_HIGH()
            mycam.clear_fifo_flag()
            finished = 1
            return finished

def capture_image():
    mycam.flush_fifo()
    mycam.clear_fifo_flag()
    mycam.start_capture()
    finished = 0
    while finished == 0:
        if mycam.get_bit(ARDUCHIP_TRIG,CAP_DONE_MASK)!=0:
            finished = get_still(mycam)
    print('Capture Finished!')
    print(get_filename())

while True:
    if not trigger.value:
        print("Triggered")
        if not isCapturing:
            isCapturing = True
            capture_image();
            imageCounter = imageCounter + 1
    else:
        isCapturing = False
        pass

    utime.sleep(0.1)