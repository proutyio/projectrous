import socket
import sys
import threading
import time
import rous.utils.utils as utils
import rous.utils.network as network




def start_gui():
	try:
		print
		print "-----------------"
		print " User Interface"
		print "-----------------"	
		while exit:
			print
			print "Option 1: ON"
			print "Option 2: OFF"
			# print "Option 3: Yellow ON"
			# print "Option 4: Yellow OFF"
			print 
			print


			services = {1 : "led:solid:green:on",
						2 : "led:solid:green:off",
						# 3 : "led:solid:yellow:on",
						# 4 : "led:solid:yellow:off",
						}

			choice = input("Choose an option: ")
			message = services[int(choice)]
			network.send_multicast_message(message,"user")

	except:
		print "GUI Failed.."



start_gui()