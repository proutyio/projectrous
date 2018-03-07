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
import rous.utils.encryption as encryption


#### MCAST MESSAGE FORMAT: ####
#
#    tag               format
#
#  service        = {"tag", "service", "params"}
#  info, error    = {"tag", "message"}
#  confirm        = {"tag", "id"}
#  whois          = {"tag"}
#
#############################

#### TCP MESSAGE FORMAT: ####
#
#    tag            format
#
#    key    = {"tag", "keytype", "newkey"}
#
#############################


self_ip = network.find_my_ip()
ukey = utils.ukey()
akey = utils.akey()

# IMPORTANT - Program sits here for most of its life 
def wait_for_message(sock):
    while True:
        data, (host,port) = sock.recvfrom(1024)
        message = (data,(host,port))  

        if message:
            print decrypt_message(message)
            # if not check_trust(host, data):
                # choose_path(message, sock)



#
def decrypt_message(message):
    (msg, (data, host)) = message
    return encryption.decrypt(msg, ukey)




# if host is in list return true, returns empty list
# else return original list
def check_trust(host, data):
    for h in utils.read_from_whitelist(self_ip):
        for s in h:
            if((host == s.rstrip()) or (data.isdigit())):
                return False
    return True




# choose the path the message will take
def choose_path(message, sock): 
    if extract_tag(message) == "service": service_path(message, sock)
    elif extract_tag(message) == "whois": whois_path()
    elif extract_tag(message) == "info":  info_path()
    elif extract_tag(message) == "error": error_path()
    else: return



#
def service_path(message, sock):
    if check_service_exists( extract_message(message) ):
        if bid_on_service(sock):
            network.send_multicast_message("info,"+self_ip+"WON BID",ukey,self_ip)
            services.run_service(extract_message(message),
                                 extract_parameters(message),
                                 self_ip)


#
def whois_path():
    send_multicast_message("info, whois, "+self_ip)


# these are here incase I want to use them later.
def info_path(): pass
def error_path(): pass


# takes in a tuple of (msg, (h,p))
# returns string 
def extract_tag(message):
    try:
        tag = message[0].split(",")[0]
        return tag
    except:
        network.send_multicast_message("error, ERROR - tag missing",ukey,self_ip)



# takes in a tuple of (msg, (h,p))
# returns string 
def extract_message(message): 
    try:
        msg = message[0].split(",")[1]
        return msg.strip()
    except:
        network.send_multicast_message("error, ERROR - message missing",ukey,self_ip)



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
    network.send_multicast_message("info,"+self_ip+": PLACED BID",ukey,self_ip) 
    t = threading.Thread(target=network.send_multicast_message, args=(my_bid,ukey,self_ip))
    t.start()


#
def thread_timer():
    TTL = .4
    timeout = time.time()+TTL
    global stop
    while True:
        if(time.time() > timeout):
            stop = True
            network.send_multicast_message("",ukey,self_ip)#dont delete, cycles bid loop
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
        if not check_trust(host, ""):
            if bid.isdigit():
                bids.append(int(bid))



# send out "stop" message to stop tcp message
#   when ctrl z signal comes in
def stop_tcp_server():
    network.send_tcp_message("stop")


#
def handle_crtl_c(signal, frame):
    print "\nSIGNAL: ctrl c"
    stop_tcp_server()
    sys.exit(0)


#
def main():
    # try:
        mcast_sock = network.start_multicast_receiver(self_ip)
        network.send_multicast_message("info, "+self_ip+": STARTING mcast reciever",ukey,self_ip)

        network.send_multicast_message("info, "+self_ip+": STARTING tcp server",ukey,self_ip)
        tcp_sock = network.start_tcp_server(self_ip)

        network.send_multicast_message("info, "+self_ip+": WAITING for messages",ukey,self_ip)
        wait_for_message(mcast_sock)
    # except:
        # network.send_multicast_message("error, ERROR - main failed: "+self_ip,self_ip)


signal.signal(signal.SIGINT, handle_crtl_c)
if __name__ == "__main__":
    main()
