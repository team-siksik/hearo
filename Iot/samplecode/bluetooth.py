import board
import busio
bluetooth = busio.UART(board.GP0, board.GP1, baudrate=9600)
while True:
    response = bluetooth.readline()
    if response is not None:
        print(response)
        print(response.decode())
