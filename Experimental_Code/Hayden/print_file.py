import cups
import os
import sys

def check_args():
    if (len(sys.argv) !=2):
        print('incorrect amount of arguments')
        exit(2)
def do_print():
    for printer in printers:
        print "printing to " + printer, printers[printer]["device-uri"]
    printer_name = printers.keys()[0]
    conn.printFile(printer_name, objective, objective, {"cpi": "12", "lpi": "8"})

check_args()
objective = sys.argv[1]
conn = cups.Connection()
printers = conn.getPrinters()
do_print()

