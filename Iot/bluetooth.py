from machine import Pin, UART
uart = UART(0, 9600)

print('start pico bluetooth test')
cmd = ''
CommandStarted = False
led = Pin(25, Pin.OUT)
while True:
    if uart.any():
        command = uart.readline()
        print(command)   # uncomment this line to see the recieved data
        if command==b'1':
            led.high()
            print("ON")
        elif command==b'0':
            led.low()
            print("OFF")

                