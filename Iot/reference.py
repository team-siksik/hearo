########Section_1##########
import sys
import bs4
from bs4 import BeautifulSoup as soup
from urllib.request import urlopen
import os
import sys
from luma.core.interface.serial import i2c
from luma.core.render import canvas
from luma.oled.device import ssd1306, ssd1325, ssd1331, sh1106
import time
import datetime
import wolframalpha
import speech_recognition as sr
import pyaudio
import wikipedia
from picamera import PiCamera
import dropbox
import picamera
from twilio.rest import Client

##########Section_2###########
contacts= {'Pizza Hut': "718-822-2909", 'Papa John's': "415-586-7272", 'Friend3': "316-316-316"}

#Wolfram
app_id = ('') #WolfRam Alpha ID

#Dropbox
dropbox_access_token= "" #Unique Dropbox token

#Twilio
twilio_account_sid = '' #You will find this information in your Twilio account
twilio_auth_token = ''          
twilio_client = Client(twilio_account_sid, twilio_auth_token)

client = wolframalpha.Client(app_id)
res = client.query('what is the temperature in San Fransisco') #Replace with the name of your city
answer = next(res.results).text
str1 = answer
str2 = str1.split('(', 1)[0]

bad_chars = [';', '|', '(', ')', '+', '=', '1'] #We use this to remove all of the characters that Espeak can't say

num = ["05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "0"] #At these points in every hour the glasses will refresh the weather data

#######Section_3#################

def util2():
  cdt = datetime.datetime.now()
  min1 = str(cdt.minute)
  hour = str(cdt.hour)

  with canvas(device) as draw:
    draw.text((0, 0), hour, fill = "blue")
    draw.text((11, 0),":", fill = "blue")
    draw.text((15, 0), min1, fill = "blue")
    draw.text((0, 0), "___________", fill = "yellow")
    #draw.text((0, 9), date, fill = "white")
    draw.text((33, 0), str2, fill = "white")
    #draw.text((0, 115), "...", fill = "white")


def util3():
  cdt = datetime.datetime.now()
  min1 = str(cdt.minute)
  hour = str(cdt.hour)

  with canvas(device) as draw:
    draw.text((0, 0), hour, fill = "blue")
    draw.text((11, 0),":", fill = "blue")
    draw.text((15, 0), min1, fill = "blue")
    draw.text((0, 0), "___________", fill = "yellow")
    #draw.text((0, 9), date, fill = "white")
    draw.text((33, 0), str2, fill = "white")
    draw.text((0, 115), "...", fill = "white")


def listen():
  print('listening...')
  util3()
  #with canvas(device) as draw:
    #draw.text((0, 115), "...", fill = "white")
  os.system('arecord -d 4 -f cd -t wav -D bluealsa:DEV=A0:18:12:00:9D:55,PROFILE=sco test.wav') #Replace the MAC address with that of your hedset

  r = sr.Recognizer()
  try:
    harvard = sr.AudioFile('test.wav')
    with harvard as source:
        audio = r.record(source)
    global val
    val = r.recognize_google(audio)
    print(val)
  except:
    print('sorry I couldnt understand')


def say(statment):
  statment1 = statment.replace(" ", "_")
  os.system('espeak ' + str(statment1) + ' -ven+f3 -k5 -s130 --stdout | aplay -D bluealsa:DEV=A0:18:12:00:9D:55,PROFILE=sco') #Change the MAC address here as well



def query(query):
  client = wolframalpha.Client(app_id)
  res = client.query(query)
  answer = next(res.results).text
  answer1 = answer.partition('\n')[0]
  print(answer1)

def start_up():
  hour1 = int(datetime.datetime.now().hour)
  if hour1 >= 0 and hour1 < 12:
      #print('computer: good morning')
      say('good_morning')
  elif hour1 >= 12 and hour1 < 20:
      #print('computer: good afternoon')
      say('good_afternoon')
  else:
      #print('computer: good evening')
      say('good_evening')
  say('how may i help you')


def send_sms(person, msg_to_text):
    if person in contacts:
        #say('What would you like to say')
        #listen()
        message = twilio_client.messages \
        .create(
             body= msg_to_text,
             from_='+YourTwilioNumber',  #PUT YOUR TWILIO PHONE NUMBER HERE, sry for caps
             status_callback='http://postb.in/1234abcd',
             to= contacts[person]
         )


serial = i2c(port=1, address=0x3C)#Put in the address of your display
device = ssd1306(serial, rotate=1)

text = ("What would you like to say? ")
text1 = ('\n'.join([text[i:i+11] for i in range(0, len(text), 11)]))

cdt = datetime.datetime.now()
#date = str(cdt.day) + "/" + str(cdt.month) + "/" + str(cdt.year)

start_up()

def utilitys():
  cdt = datetime.datetime.now()
  min1 = str(cdt.minute)
  hour = str(cdt.hour)

  with canvas(device) as draw:
    draw.text((0, 0), hour, fill = "blue")
    draw.text((11, 0),":", fill = "blue")
    draw.text((15, 0), min1, fill = "blue")
    draw.text((0, 0), "___________", fill = "yellow")
    #draw.text((0, 9), date, fill = "white")
    draw.text((33, 0), str2, fill = "white")
    if min1 in num:
      client = wolframalpha.Client(app_id)
      res = client.query('what is the temperature in San Fransisco')
      answer = next(res.results).text
      str1 = answer
      str3 = str1.split('(', 1)[0]
      draw.text((33, 0), str3, fill = "white")

def util(func1):
  cdt = datetime.datetime.now()
  min1 = str(cdt.minute)
  hour = str(cdt.hour)

  with canvas(device) as draw:
    draw.text((0, 0), hour, fill = "blue")
    draw.text((11, 0),":", fill = "blue")
    draw.text((15, 0), min1, fill = "blue")
    draw.text((0, 0), "___________", fill = "yellow")
    #draw.text((0, 9), date, fill = "white")
    draw.text((33, 0), str2, fill = "white")
    draw.text((0, 64), func1, fill = "white")

def upload_img():
  file = open('img.txt', 'r')
  file51 = file.read()
  file.close()
  file45 = int(file51)
  file45 += 1
  global img
  img = 'img{}.jpg'.format(file45)
  print(img)

def save_img():
  file1 = open('img.txt', 'r')
  file99 = file1.read()
  file1.close() 
  file100 = int(file99)
  file100 += 1
  file2 = str(file100)
  open('img.txt', 'w').close()
  new_num = open('img.txt', 'w')
  new_num.write(file2)
  new_num.close()
  print(file2)


def upload_vid():
  file3 = open('vid.txt', 'r')
  file61 = file3.read()
  file3.close()
  file47 = int(file61)
  file47 += 1
  global vid
  vid = 'vid{}.h264'.format(file47)
  print(vid)

def save_vid():
  file3 = open('vid.txt', 'r')
  file101 = file3.read()
  file3.close() 
  file102 = int(file101)
  file102 += 1
  file7 = str(file102)
  open('vid.txt', 'w').close()
  new_num2 = open('vid.txt', 'w')
  new_num2.write(file7)
  new_num2.close()
  print(file7)


########Section_4#############

while True:
  utilitys()
  listen()
  try:
    if len(val) >= 2:
      if 'news' in val:
        news_url="https://news.google.com/news/rss"
        Client=urlopen(news_url)
        xml_page=Client.read()
        Client.close()
        soup_page=soup(xml_page,"xml")
        news_list=soup_page.findAll("item")
        # Print news title, url and publish date
        i = 0
        util('news...')
        for news in news_list:
          print(news.title.text + "\n")
          say(news.title.text)
          #print(news.link.text)
          #print(news.pubDate.text)
          #print("-"*60)
          i += 1
          time.sleep(1)
          if i == 3:
            break
        del val
        util("news...")
        time.sleep(3)      


      if 'exit program' in val:
        os.system('pkill -f main.py')
        del val

      if 'SMS' in val:
          del val
          say('who would you like to send a text to?')
          listen()
          dude = str(val)
          del val
          say('what would you like to say')
          listen()
          msg_to_send = str(val)
          del val
          send_sms(dude, msg_to_send)
          util("SMS sent!")
          time.sleep(3)


      if 'time' in val:
        cdt1 = datetime.datetime.now()
        h = cdt1.hour
        m = cdt1.minute
        print(str(h) + ':' + str(m))
        say(str(h))
        say(str(m))

        del val
        util("time...")
        time.sleep(3)

      if 'picture' in val:
        camera = PiCamera()
        upload_img()
        img_name = img
        camera.start_preview()
        time.sleep(5)
        camera.capture(img_name)
        camera.stop_preview()
        save_img()
        dropbox_path= "/SmartGlassesAPI/{}".format(img_name)   #Go to your Dropbox profile and make a folder named SmartGlassesAPI
        computer_path = r'/home/pi/{}'.format(img_name)
        client = dropbox.Dropbox(dropbox_access_token)
        client.files_upload(open(computer_path, "rb").read(), dropbox_path)
        print('image saved to dropbox account')
        say('image save to drop box account')
        del img
        del val
        util("saved...")
        time.sleep(3)


      if 'play my music' in val:
        util("music...")
        time.sleep(2)

	#replace the 00:00:00:00:00:00 with the MAC address of your headset
        os.system('aplay -D bluealsa:DEV=00:00:00:00:00:00,PROFILE=sco /home/pi/Desktop/Imagine.wav')
        del val
        say('would you like me to play the next song')
        listen()
        if 'yes' in val:                 #Dang I guess I should have stored this in a variable
          os.system('aplay -D bluealsa:DEV=00:00:00:00:00:00,PROFILE=sco /home/pi/Desktop/BeautifulName.wav')
          del val
          say('would you like me to play the next song')
          listen()
          if 'yes' in val:                      #Lol, you have to do it again
            os.system('aplay -D bluealsa:DEV=00:00:00:00:00:00,PROFILE=sco /home/pi/Desktop/Oceans.wav')
            del val
        if 'no' in val:
          del val 
          continue


      if 'video' in val: 
        upload_vid()
        vid_name = vid
        #vid_name = str(vid_name)
        with picamera.PiCamera() as camera:
          camera.start_recording(vid_name)
          time.sleep(30)
          camera.stop_recording()
          save_vid()
          new_vid_name = vid_name.replace('.h264', '.mp4')
          command = "MP4Box -add {} {}".format(vid_name, new_vid_name)
          subprocess.call([command], shell=True)
          dropbox_path= "/SmartGlassesAPI/{}".format(new_vid_name)
          computer_path = r'/home/pi/{}'.format(new_vid_name)
          client = dropbox.Dropbox(dropbox_access_token)
          client.files_upload(open(computer_path, "rb").read(), dropbox_path)
          time.sleep(3)
          print('video saved to dropbox account')
          say('video save to drop box account')
          del vid
          del val
          util("saved...")
          time.sleep(3)   

#############section_5######################

      try:
        client1 = wolframalpha.Client(app_id)
        res1 = client1.query(val)
        answer1 = next(res1.results).text
        answer2 = answer1.partition('\n')[0]
        for i in bad_chars:
          answer2 =  answer2.replace(i, '')
        print(answer2)
        say(answer2)
      except:
        try:
          print(wikipedia.summary(val, sentences = 1))
          say(wikipedia.summary(val, sentences = 1))
        except:
          print('')
      del val
  except:
    print(' ')
    #del val
################THE_END##########################