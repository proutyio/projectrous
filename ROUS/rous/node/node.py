#!/usr/bin/python
import socket
import sys
import signal
import struct
import random
import threading
import time
import json
# import logging as log
from functools import partial
import rous.utils.utils as utils
import rous.utils.services as services
import rous.utils.network as network
import rous.utils.encryption as encryption


#### MCAST MESSAGE FORMAT: ####
#
#    tag               format
#
#  service        = {tag:"", service:"", params:[]}
#  info, error    = {tag:"", message:"", address:""}
#  bid            = {tag:"", bid:"", address:""}
#  confirm        = {tag:"", id:""}
#  whois          = {tag:""}
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
bids = []

# IMPORTANT - Program sits here for most of its life 
def wait_for_message(sock):
    while True:
        message, (host,port) = sock.recvfrom(1024)

        if message:
            msg = decrypt_message(message)
            # if check_trust(host, data):
            try:
                # print json.loads(msg)
                choose_path(msg, sock)
            except:
                print "bad message"

#
def decrypt_message(message):
    return encryption.decrypt(message, ukey)




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
    m = json.loads(message)
    if m['tag'] == "service": service_path(m, sock)
    elif m['tag'] == "info":  info_path()
    elif m['tag'] == "error": error_path()
    elif m['tag'] == "whois": whois_path()
    elif m['tag'] == "bid": bid_path(m)
    else: return



#
def service_path(msg, sock):
    if check_service_exists(msg):
        del bids[:]
        my_bid = random.randint(1,1000)
        timer(my_bid)
        place_bid(my_bid)
        return    


#
def whois_path():
    servs = json.dumps(services.all_services())
    network.send_multicast_message(
        '{"tag":"info","message":"whois","address":"'
        +self_ip+'","services":'+servs+'}',ukey,self_ip)



#
def bid_path(msg):
    if msg['tag'] == "bid":
        if msg['bid'].isdigit():
            bids.append(msg['bid'])
            return


# these are here incase I want to use them later.
def info_path(): pass
def error_path(): pass



#calls function in services module that returns list of
#   services in services module. Then loop list and find if
#   input string is in list.
def check_service_exists(msg):
    svc = json.loads(json.dumps(msg))['service']
    all_svc = services.all_services()
    all_svc = all_svc[1:-1]
    all_svc = all_svc.split(',')
    for s in all_svc:
        if(svc == json.loads(s)['service']): 
            return True
    return False


#
# def bid_on_service(sock):
#     bids = []
#     my_bid = random.randint(1,1000)

#     place_bid(my_bid)
#     wait_for_bids(sock, bids)

#     if bids: #for  testing
#         print "My Bid: "+str(my_bid)
#         print "Bids: "+str(bids)
   
#     if bids and (my_bid >= max(bids)):
#         log.info("%s - won bid", self_ip)
#         print "\tWON"
#         return True
#     else:
#         log.info("%s - lost bid or bid empty", self_ip)
#         print "\tLOST" 
#         return False



# thread dies after it sends bid to multicast group
def place_bid(my_bid):
    network.send_multicast_message(
        '{"tag":"bid","bid":"'+str(my_bid)+'","address":"'+self_ip+'"}',ukey,self_ip)
    t = threading.Thread(target=network.send_multicast_message, args=(my_bid,ukey,self_ip))
    t.start()


#
def thread_timer(my_bid):
    TTL = 1
    timeout = time.time()+TTL
    global stop
    while True:
        if(time.time() > timeout):
            stop = True
            network.send_multicast_message(
                '{"tag":"timer"}',ukey,self_ip)#dont delete, cycles bid loop
            finish_bidding(my_bid)
            break

#
def timer(my_bid):
    t = threading.Thread(target=thread_timer, args=[my_bid])
    t.start()



#
def finish_bidding(my_bid):
    try:
        print "my_bid"+str(my_bid)
        print json.dumps(bids)
        
        if bids and (my_bid >= max(bids)):
            print "\tWON"
            network.send_multicast_message(
                '{"tag":"info","message":"won bid","address":"'+self_ip+'"}',ukey,self_ip)
            services.run_service(msg['service'],self_ip)
        else:
            print "\tLOST" 
    except:
        print "finish_bidding failed"
    finally:
        del bids[:]



# bid recieved as (bid, (host, port))
# def wait_for_bids(sock, bids):
#     global stop
#     stop = False    
#     timer()
#     while True:
#         if stop:
#             stop = False
#             break
        # msg, (host,port) = sock.recvfrom(1024)
        # msg = decrypt_message(msg)
        # print
        # print msg
        # print
        # # if check_trust(host, ""):       #FIX HERE
        # if msg.isdigit():
        #     bids.append(int(msg))
        #     print str(bids)+"bids"



# send out "stop" message to stop tcp message
#   when ctrl z signal comes in
def stop_tcp_server():
    network.send_tcp_message(self_ip,"stop")


#
def handle_crtl_c(signal, frame):
    print "\nSIGNAL: ctrl c"
    stop_tcp_server()
    sys.exit(0)


#
def main():
    try:
        mcast_sock = network.start_multicast_receiver(self_ip)
        network.send_multicast_message(
            '{"tag":"info","message":"starting mcast reciever","address":"'
            +self_ip+'"}',ukey,self_ip)

        network.send_multicast_message(
            '{"tag":"info","message":"starting tcp server","address":"'
            +self_ip+'"}',ukey,self_ip)
        tcp_sock = network.start_tcp_server(self_ip)

        network.send_multicast_message(
            '{"tag":"info","message":"waiting for message","address":"'
            +self_ip+'"}',ukey,self_ip)
        wait_for_message(mcast_sock)
    except:
        pass
        # network.send_multicast_message("error, ERROR - main failed: "+self_ip,self_ip)


signal.signal(signal.SIGINT, handle_crtl_c)
if __name__ == "__main__":
    main()
