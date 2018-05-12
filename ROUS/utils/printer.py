import os
import sys
import cups
from subprocess import call

# logic to find and print to a printer. fallback command line function to print
#	to default printer that is connected to RPi

def find_printer():
	conn = cups.Connection()
	printers = conn.getPrinters()
	for p in printers:
		print p
	return (conn, printers.keys()[0])

def print(file):
	(conn, printer) = find_printer()
	conn.printFile(printer, file, "", {"cpi": "12", "lpi": "8"})

def print_file(file):
	os.system("lp ~/ROUS/rous/utils/m.txt")
