import time
import board
from digitalio import DigitalInOut, Direction

touch_pin = board.GP26

touchpad = DigitalInOut(touch_pin)
touchpad.direction = Direction.INPUT

already_pressed = False

while True:

    if touchpad.value and not already_pressed:
        print("pressed")

    already_pressed = touchpad.value
    time.sleep(0.1)