import RPi.GPIO as rpi
import time
import threading
import logging as log
import rous.utils.utils as utils

pin_green = 17
pin_yellow = 18
green_threads = []
yellow_threads = []

rpi.setmode(rpi.BCM)
rpi.setwarnings(False)
rpi.setup(pin_green,rpi.OUT)
rpi.setup(pin_yellow,rpi.OUT)

def thread_green_on():
	try:
		log.info("LED - green on")
		for t in green_threads:
			while getattr(t, "exit", True):
				rpi.output(pin_green,rpi.HIGH)
	except:
		log.error("Failed to turn green on")


def green_on():
	t = threading.Thread(target=thread_green_on)
	green_threads.append(t)
	t.start()


def green_off():
	rpi.output(pin_green,rpi.LOW)
	for t in green_threads:
		t.exit = False
		t.join()
		log.info("LED - green off")


def thread_yellow_on():
	try:
		log.info("LED - yellow on")
		for t in yellow_threads:
			while getattr(t, "exit", True):
				rpi.output(pin_yellow,rpi.HIGH)
	except:
		log.error("Failed to turn yellow on")


def yellow_on():
	t = threading.Thread(target=thread_yellow_on)
	yellow_threads.append(t)
	t.start()


def yellow_off():
	rpi.output(pin_yellow,rpi.LOW)
	for t in yellow_threads:
		t.exit = False
		t.join()
		log.info("LED - yellow off")





