import cups
import os
import sys
import io
import rous.utils.utils as utils
import rous.utils.network as network
import rous.utils.printer as printer



# def find_printer():
# 	conn = cups.Connection()
# 	printers = conn.getPrinters()
# 	return (conn, printers.keys()[0])


# def print_file(file):
# 	(conn, printer) = find_printer()
# 	conn.printFile(printer, file, file, {"cpi": "12", "lpi": "8"})





def send():
	print "print_file"
	network.send_multicast_message("print_file","address")
send()



# def test_node_dicovery():
# 	lst = utils.discover_nodes()
# 	utils.write_to_whitelist(lst)


# def test_find_ip():
# 	return utils.find_my_ip()



# test_node_dicovery()

# ip = test_find_ip()
# print ip 
# print utils.find_ip_from_string(ip)

# import commands
# print commands.getstatusoutput('ip -4 addr | grep -oP ((?<=inet\s)\d+(\.\d+)(3))')



# pins = {"green" : 18,
# 		"red"	: 17,
# 		"blue"	: 27,
# 		}

# threads = {"green" : [],}

# def thread(color):
# 	try:
# 		threads[color].append("test1")
# 		threads[color].append("test2")

# 		print threads["green"][1]
# 	except:
# 		pass
# thread("green")
