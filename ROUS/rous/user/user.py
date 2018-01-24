import socket
import sys
import threading
import time
import rous.utils.utils as utils
import rous.utils.network as network


port = 22000
host_list = []
threads = []



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
		#t.join()



def generate_host_list():
	start_message_thread()
	host_list.append(network.discover_nodes())
	end_message_thread()




def send_message(message):
	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	try:
		if host_list[0]:
			for host in host_list[0]:
				sent = sock.sendto(message, (host[0], port))
		else:
			print "\nNo Nodes Found\n"
	finally:
		sock.close()



def start_gui():
	#try:
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
			print "Option 7: Discover nodes"
			print 


			services = {1 : "led:solid:green:on",
						2 : "led:solid:green:off",
						3 : "led:solid:yellow:on",
						4 : "led:solid:yellow:off",
						5 : "led:all:on",
						6 : "led:all:off",
						}

			send_message(services[int(input("Choose an option: "))])

	#except:
	#	print "GUI Failed.."



generate_host_list()
start_gui()