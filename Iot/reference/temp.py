"""
MicroPython/PyBoard exercise run on Pyb v1.1,
+ 1.8" 128x160 TFT ST7735 SPI

using GuyCarver/MicroPython
https://github.com/GuyCarver/MicroPython
"""
import uos
import usys
import time
import random
import ST7735
from seriffont import seriffont
from sysfont import sysfont
from terminalfont import terminalfont

print("====================================")
print(usys.implementation[0], uos.uname()[3],
      "\nrun on", uos.uname()[4])
print("------------------------------------")

print("====================================")

display = ST7735.tft(aLoc=1, aDC='Y9', aReset='Y10')

displaysize = display.size()
print(displaysize)

display.initg() # or initr()/initb() according to your display

display.rotation(1)
display.fill(display._BLACK)
display.text((0,0),
             usys.implementation[0]+' '+uos.uname()[3],
             display._WHITE,
             terminalfont)
time.sleep(1)
display.text((0,30),
             "run on "+uos.uname()[4],
             ST7735.TFTColor(0xFF, 0xFF, 0xFF),
             terminalfont)
time.sleep(3)

#font test
display.fill(display._BLACK)
display.text((0,0),
             "seriffont",
             display._RED,
             seriffont)
display.text((0,10),
             "abcdefghijklmnopqrstuvwxyz",
             display._WHITE,
             seriffont)
display.text((0,30),
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
             display._WHITE,
             seriffont)
display.text((0,50),
             "sysfont",
             display._RED,
             sysfont)
display.text((0,60),
             "abcdefghijklmnopqrstuvwxyz",
             display._WHITE,
             sysfont)
display.text((0,70),
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
             display._WHITE,
             sysfont)
display.text((0,80),
             "terminalfont",
             display._RED,
             terminalfont)
display.text((0,90),
             "abcdefghijklmnopqrstuvwxyz",
             display._WHITE,
             terminalfont)
display.text((0,110),
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
             display._WHITE,
             terminalfont)
time.sleep(5)

display.rotation(0)
display.fill(display._RED)
display.text((10,10),
             "RED",
             ST7735.TFTColor(0xFF, 0xFF, 0xFF),
             terminalfont,
             aSize=2)
time.sleep(1)

display.fill(display._GREEN)
display.text((10,10),
             "GREEN",
             ST7735.TFTColor(0xFF, 0xFF, 0xFF),
             terminalfont,
             aSize=2)
time.sleep(1)

display.fill(display._BLUE)
display.text((10,10),
             "BLUE",
             ST7735.TFTColor(0xFF, 0xFF, 0xFF),
             terminalfont,
             aSize=2)
time.sleep(1)

#rotation test
display.rotation(0)
display.fill(display._BLACK)
display.fillrect((1,1),
                 (display.size()[0]-2, display.size()[1]-2),
                 display._WHITE)
display.text((0,0),
             "rotate = "+str(display.rotate)+" : "+str(display.size()),
             display._BLACK,
             terminalfont)
print("rotate = "+str(display.rotate)+" : "+str(display.size()))
time.sleep(2)

display.rotation(1)
display.fillrect((2,2),
                 (display.size()[0]-4, display.size()[1]-4),
                 display._BLACK)
display.text((0,0),
             "rotate = "+str(display.rotate)+" : "+str(display.size()),
             display._WHITE,
             terminalfont)
print("rotate = "+str(display.rotate)+" : "+str(display.size()))
time.sleep(2)

display.rotation(2)
display.fillrect((3,3),
                 (display.size()[0]-6, display.size()[1]-6),
                 display._WHITE)
display.text((0,0),
             "rotate = "+str(display.rotate)+" : "+str(display.size()),
             display._BLACK,
             terminalfont)
print("rotate = "+str(display.rotate)+" : "+str(display.size()))
time.sleep(2)

display.rotation(3)
display.fillrect((4,4),
                 (display.size()[0]-8, display.size()[1]-8),
                 display._BLACK)
display.text((0,0),
             "rotate = "+str(display.rotate)+" : "+str(display.size()),
             display._WHITE,
             terminalfont)
print("rotate = "+str(display.rotate)+" : "+str(display.size()))
time.sleep(2)

#Random pixel
for p in range(1000):
    x = random.randint(5, display.size()[0]-10)
    y = random.randint(5, display.size()[1]-10)
    c = ST7735.TFTColor(random.randint(0, 0xFF),
                        random.randint(0, 0xFF),
                        random.randint(0, 0xFF))
    display.pixel((x, y), c)
    
#Random line
for l in range(100):
    display.line((random.randint(5, display.size()[0]-10),
                  random.randint(5, display.size()[1]-10)),
                 (random.randint(5, display.size()[0]-10),
                  random.randint(5, display.size()[1]-10)),
                 ST7735.TFTColor(random.randint(0, 0xFF),
                        random.randint(0, 0xFF),
                        random.randint(0, 0xFF)))

#Random circle
for l in range(20):
    display.circle((random.randint(5, display.size()[0]-10),
                    random.randint(5, display.size()[1]-10)),
                   random.randint(1, 50),
                   ST7735.TFTColor(random.randint(0, 0xFF),
                                   random.randint(0, 0xFF),
                        random.randint(0, 0xFF)))
    
#Random fillcircle
for l in range(20):
    display.fillcircle((random.randint(5, display.size()[0]-10),
                    random.randint(5, display.size()[1]-10)),
                   random.randint(1, 50),
                   ST7735.TFTColor(random.randint(0, 0xFF),
                                   random.randint(0, 0xFF),
                        random.randint(0, 0xFF)))

print("~ bye ~")
