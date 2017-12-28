#Prints a file to the first printer connected to the device NOTE: needs error checking
#needs an argument that is a text file

import cups
import os
import sys

objective = sys.argv[1]

conn = cups.Connection()
printers = conn.getPrinters()

for printer in printers:
    print "printing to " printer, printers[printer]["device-uri"]
printer_name = printers.keys()[0]
conn.printFile(printer_name, objective, {"cpi": "12", "lpi": "8"})