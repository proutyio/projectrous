#!/usr/bin/python
import socket
import sys
import signal
import struct
import random
import threading
import time
import logging as log
from Queue import Queue
from functools import partial
import rous.utils.utils as utils
import rous.utils.services as services
import rous.utils.network as network


threads = []
self_ip = network.find_my_ip()


# IMPORTANT - Program sits here for most of its life 
def wait_for_message(sock):
    while True:

        data, (host,port) = sock.recvfrom(1024)
        message = (data,(host,port))        

        if not filter_message(host, data):
            # print
            # print self_ip+" RECIEVED: "+message[0]+" "+message[1][0]+" "+str(message[1][1])
            network.send_multicast_message(self_ip+" RECIEVED: "+
                                                    message[0]+" "+
                                                    message[1][0]+
                                                    " "+str(message[1][1]))
            if message:
                msg_str = parse_message(message)
                if check_service_exists(msg_str):
                    if bid_on_service(sock):
                        services.run_service(msg_str, self_ip)



# if host is in list return true, returns empty list
# else return original list
def filter_message(host, data):
    for h in utils.read_from_whitelist(self_ip):
        for s in h:
            if((host == s.rstrip()) or (str(data) == "stop") or (data.isdigit())):
                #log.info("%s - FILTERED message from: %s",self_ip,s.rstrip())
                return True
    return False



# takes in a tuple of (msg, (h,p))
# returns string 
def parse_message(message):
    msg_lst = message[0].split()
    msg_str = msg_lst[0]
    return msg_str



#calls function in services module that returns list of
#   services in services module. Then loop list and find if
#   input string is in list.
def check_service_exists(msg_str):
    for s in services.all_services():
        if(msg_str == s): 
            return True
    return False



#
def bid_on_service(sock):
    bids = []
    my_bid = random.randint(1,1000)

    place_bid(my_bid)
    wait_for_bids(sock, bids)

    if bids: #for  testing
        print "My Bid: "+str(my_bid)
        print "Bids: "+str(bids)
   
    if bids and (my_bid > max(bids)):
        log.info("%s - won bid", self_ip)
        print "\tWON"
        return True
    else:
        log.info("%s - lost bid or bid empty", self_ip)
        print "\tLOST" 
        return False



# thread dies after it sends bid to multicast group
def place_bid(my_bid):  
    t = threading.Thread(target=network.send_multicast_message, args=(my_bid, self_ip))
    t.start()



def thread_timer():
    TTL = .4
    timeout = time.time()+TTL
    
    global stop
    while True:
        if(time.time() > timeout):
            stop = True
            network.send_multicast_message("stop",self_ip)
            break


def timer():
    t = threading.Thread(target=thread_timer)
    t.start()



# bid recieved as (bid, (host, port))
def wait_for_bids(sock, bids):
    global stop
    stop = False
    
    timer()
    while True:
        if stop:
            stop = False
            break
        print stop
        bid, (host,port) = sock.recvfrom(1024)

        if not filter_message(host, ""):
            if bid.isdigit():
                bids.append(int(bid))


def main():
    #try:
        sock = network.start_multicast_reciever(self_ip)
        wait_for_message(sock)
   # except:
        # log.error("%s - ERROR - main failed",self_ip)


signal.signal(signal.SIGINT, partial(utils.handle_crtl_z, self_ip))
if __name__ == "__main__":
    main()
