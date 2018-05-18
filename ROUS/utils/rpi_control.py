import RPi.GPIO as rpi
import time
import threading
import utils
import config

# RPi control manages turning on and off GPIO pins

green_threads = []
red_threads = []
blue_threads = []
pink_threads = []
yellow_threads = []
white_threads = []

led_timeout = 15

pins = [("green",int(config.settings("green_pin")),green_threads),
		("red",int(config.settings("red_pin")),red_threads),
		("blue",int(config.settings("blue_pin")),blue_threads),
		("pink",int(config.settings("pink_pin")),pink_threads),
		("yellow",int(config.settings("yellow_pin")),yellow_threads),
		("white",int(config.settings("white_pin")),white_threads)]

def setup():
	rpi.setmode(rpi.BCM)
	rpi.setwarnings(False)
	for p in pins:
		rpi.setup(p[1],rpi.OUT)
setup()


def thread_on(str_pin):
	print "ON"
	(pin, threads) = find_pin(str_pin)
	for t in threads:
		while getattr(t, "exit", True):
			rpi.output(pin,rpi.HIGH)
			

def off(str_pin):
	(pin, threads) = find_pin(str_pin)
	try:
		for t in threads:
			t.exit = False
			t.join()
	finally:
		rpi.output(pin,rpi.LOW)
		del threads[:]


def on(str_pin):
	(pin, threads) = find_pin(str_pin)
	if not threads:
		t = threading.Thread(target=thread_on, args=[str_pin])
		threads.append(t)
		t.start()


def find_pin(pin):
	for p in pins:
		if p[0] == pin:
			return (p[1],p[2])
