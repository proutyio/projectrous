#!/usr/bin/python
import socket
import sys
import signal
import struct
import random
import threading
import time
import logging as log
from functools import partial
import rous.utils.utils as utils
import rous.utils.services as services
import rous.utils.network as network


####    MESSAGE FORMAT: ####
#
#   tag              format
#
#  service   = {"tag", "service", "params"}
#  info      = {"tag", "message"}
#  confirm   = {"tag", "id"}
#
#############################


self_ip = ""


# IMPORTANT - Program sits here for most of its life 
def wait_for_message(sock):
    while True:
        data, (host,port) = sock.recvfrom(1024)
        message = (data,(host,port))  

        if message:
            if check_trust(host, data):
                filter_by_tag(message)




# if host is in list return true, returns empty list
# else return original list
def check_trust(host, data):
    for h in utils.read_from_whitelist(self_ip):
        for s in h:
            if((host == s.rstrip()) or (data.isdigit())):
                network.send_multicast_message(
                    "info, UNTRUSTED node - filtered message from: %s",self_ip,s.rstrip())
                return False
    return True




# choose the path the message will take
def filter_by_tag(message):    
    if extract_tag(message) == "service": service_tag(message)
    elif extract_tag(message) == "info":  info_tag()
    elif extract_tag(message) == "error": error_tag()



#
def service_tag(message):
    if check_service_exists( extract_message(message) ):
        if bid_on_service(sock):
            network.send_multicast_message("info,"+message[0]
                +" "+message[1][0]
                +" "+str(message[1][1]), self_ip)
            services.run_service(msg, self_ip)
            return True
    else:
        return False



#
def info_tag():
    pass



#
def error_tag():
    pass



# takes in a tuple of (msg, (h,p))
# returns string 
def extract_tag(message):
    try:
        tag = message[0].split(",")[0]
    except:
        print "tag missing"
        #send error message out
    return tag



# takes in a tuple of (msg, (h,p))
# returns string 
def extract_message(message): 
    try:
        msg = message[0].split(",")[1]
     except:
        print "message missing"
        #send error message out
    return msg



# takes in a tuple of (msg, (h,p))
# returns list of strings 
def extract_parameters(message): 
    lst = message[0].split(',')
    params = []
    for p in lst:
        if not (p == extract_tag(message) or p == extract_message(message) ):
            params.append(p)
    return params



#calls function in services module that returns list of
#   services in services module. Then loop list and find if
#   input string is in list.
def check_service_exists(msg):
    #network.send_multicast_message("CHECK "+self_ip+" checking if service exists", self_ip)
    for s in services.all_services():
        if(msg == s): 
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
   
    if bids and (my_bid >= max(bids)):
        log.info("%s - won bid", self_ip)
        print "\tWON"
        return True
    else:
        log.info("%s - lost bid or bid empty", self_ip)
        print "\tLOST" 
        return False



# thread dies after it sends bid to multicast group
def place_bid(my_bid):
    network.send_multicast_message("info,"+self_ip+": PLACED BID", self_ip) 
    t = threading.Thread(target=network.send_multicast_message, args=(my_bid, self_ip))
    t.start()


#
def thread_timer():
    TTL = .4
    timeout = time.time()+TTL
    global stop
    while True:
        if(time.time() > timeout):
            stop = True
            break

#
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
        bid, (host,port) = sock.recvfrom(1024)
        #if not check_trust(host, ""):
        if bid.isdigit():
            bids.append(int(bid))


#
def find_my_ip():
    self_ip = network.find_my_ip()



#
def main():
    #try:
        find_my_ip()
        network.send_multicast_message("info,"+self_ip+": STARTING", self_ip)
        
        sock = network.start_multicast_reciever(self_ip)
        wait_for_message(sock)
   # except:
        # log.error("%s - ERROR - main failed",self_ip)


signal.signal(signal.SIGINT, partial(utils.handle_crtl_z, self_ip))
if __name__ == "__main__":
    main()
