import RPi.GPIO as rpi
import time

pin_green = 18
pin_yellow = 17

rpi.setmode(rpi.BCM)
rpi.setwarnings(False)
rpi.setup(pin_green,rpi.OUT)
rpi.setup(pin_yellow,rpi.OUT)

def green_on():
	rpi.output(pin_green,rpi.HIGH)

def green_off():
	rpi.output(pin_green,rpi.LOW)

def yellow_on():
	rpi.output(pin_yellow,rpi.HIGH)

def yellow_off():
	rpi.output(pin_yellow,rpi.LOW)