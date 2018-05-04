import os
import sys
import cups
from subprocess import call


def find_printer():
	conn = cups.Connection()
	printers = conn.getPrinters()
	# print printers
	# for p in printers:
	# 	print p
	return (conn, printers.keys()[0])


# def print_file(file):
# 	(conn, printer) = find_printer()
# 	conn.printFile(printer, file, "", {"cpi": "12", "lpi": "8"})

def print_file(file):
	os.system("lp ~/ROUS/rous/utils/m.txt")
