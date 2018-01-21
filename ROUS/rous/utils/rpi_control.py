import RPi.GPIO as rpi
import time
import threading
import logging as log
import rous.utils.utils as utils

pin_green = 18
pin_yellow = 17
green_threads = []

rpi.setmode(rpi.BCM)
rpi.setwarnings(False)
rpi.setup(pin_green,rpi.OUT)

def thread_green_on():
	try:
		for t in green_threads:
			while getattr(t, "exit", True):
				rpi.output(pin_green,rpi.HIGH)
	except:
		log.info("Failed to turn green on")


def green_on():
	t = threading.Thread(target=thread_green_on)
	green_threads.append(t)
	t.start()


def green_off():
	rpi.output(pin_green,rpi.LOW)
	for t in green_threads:
		t.exit = False
		t.join()


def yellow_on():
	rpi.setup(pin_yellow,rpi.OUT)
	rpi.output(pin_yellow,rpi.HIGH)

def yellow_off():
	rpi.output(pin_yellow,rpi.LOW)
