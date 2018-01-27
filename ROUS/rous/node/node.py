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

threads = []
self_ip = network.find_my_ip()


# IMPORTANT - Program sits here for most of its life 
def wait_for_message(sock):
    #log.info("%s - WAITING to recieve data", self_ip)
    #try:
        data, (host,port) = sock.recvfrom(4096)
        message = (data,(host,port))
        log.info("%s - RECIEVED: %s", self_ip, message)

        if not filter_message(host):
            if message:
                msg_str = parse_message(message)
                # if check_service_exists(msg_str):
                if bid_on_service(sock):
                   services.run_service(msg_str, self_ip)        

   # except(KeyboardInterrupt,RuntimeError):
      #      log.error("%s - FAILED wait_for_message", self_ip)



# if host is in list return empty true
# else return original list
def filter_message(host):
    for h in utils.read_from_whitelist(self_ip):
        for s in h:
            if(host == s.rstrip()):
                log.info("%s - FILTERED message from: %s",self_ip,s.rstrip())
                return True
    return False



# takes in a tuple of (msg, (h,p))
# returns string 
def parse_message(message):
    msg_lst = message[0].split()
    msg_str = msg_lst[0]
    return msg_str



#
def check_service_exists(msg_str):
    for s in services.all_services():
        if(msg_str == s): 
            return True
    return False



#
def bid_on_service(sock):
    TTL = 1 #seconds
    bids = []
   # try:
    my_bid = random.randint(1,100)
    place_bid(my_bid)
    wait_for_bids(sock, bids, TTL)
    
    # for b in bids:
    print my_bid
    print bids
    print max(bids)
    if(my_bid > max(bids)):
        log.info("%s - won bid", self_ip)
        print "won"
        return True
    else:
        log.info("%s - lost bid", self_ip)
        return False
  #  except:
   #    log.error("%s - FAILED bid on service", self_ip)



# thread dies after it sends bid to multicast group
def place_bid(my_bid):
 #   try:
        log.info("%s - my bid: %s",self_ip, my_bid)
        t = threading.Thread(target=network.send_multicast_message, args=(my_bid, self_ip))
        t.start()
   # except:
   #     log.error("%s - FAILED to place bid", self_ip)



# bid recieved as (bid, (host, port))
def wait_for_bids(sock, bids, TTL):
   # try:
        timeout = time.time()+TTL
        while True:
            bid, (host,port) = sock.recvfrom(4096)
            
            if not filter_message(host):
                if bid.isdigit():
                    bids.append(int(bid))

                if time.time() > timeout:
                    break
   # except:
     #   log.error("%s - FAILED to wait on bids", self_ip)



# Main loop that waits from messages from other nodes
def main():
    sock = network.start_multicast_reciever(self_ip)
    while True:
       # try:
            wait_for_message(sock)

      #  except KeyboardInterrupt:
      #      log.error("%s - FAILED main loop", self_ip)



signal.signal(signal.SIGINT, partial(utils.handle_crtl_z, self_ip))
if __name__ == "__main__":
    main()
