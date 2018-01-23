import socket
import sys
import threading
import time
import rous.utils.utils as utils


port = 22000
host_list = []
threads = []



def generate_host_list():
	start_message_thread()
	utils.scan_subnet()
	end_message_thread()
	nodes = utils.find_rpi_nodes() 
	host_list.append(utils.parse_ip_list(nodes))



def user_wait_message():
	print 
	print "scanning network..."
	print 
	for t in threads:
		while getattr(t, "exit", True):
			print "...\n"
			time.sleep(2)



def start_message_thread():
	t = threading.Thread(target=user_wait_message)
	threads.append(t)
	t.start()



def end_message_thread():
	print "starting interface..."
	print
	for t in threads:
		t.exit = False
		t.join()



def send_message(message):
	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	try:
		for host in host_list[0]:
			sent = sock.sendto(message, (host[0], port))

	finally:
		sock.close()



def start_gui():
	try:
		print
		print "-----------------"
		print " User Interface"
		print "-----------------"	
		while exit:
			print
			print "Option 1: Green ON"
			print "Option 2: Green OFF"
			print "Option 3: Yellow ON"
			print "Option 4: Yellow OFF"
			print "Option 5: All Colors ON"
			print "Option 6: All Colors OFF"
			print 


			services = {1 : "led:solid:green:on",
						2 : "led:solid:green:off",
						3 : "led:solid:yellow:on",
						4 : "led:solid:yellow:off",
						5 : "led:all:on",
						6 : "led:all:off",
						}

			send_message(services[int(input("Choose an option: "))])
	except:
		print "GUI Failed.."



generate_host_list()
start_gui()