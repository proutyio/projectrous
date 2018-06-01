#!/usr/bin/python
import socket
import sys
import signal
import struct
import random
import threading
import time
import json
from functools import partial
import utils.utils as utils
import utils.services as services
import utils.network as network
import utils.encryption as encryption

#### MCAST MESSAGE FORMAT: ####
#
#    tag               format
#
#  service        = {tag:"", service:"", services:[], uid:""}
#  info, error    = {tag:"", message:"",address:""}
#  bid            = {tag:"", bid:"", address:""}
#  confirm        = {tag:"", id:""}
#  whois          = {tag:"", address:""}
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
my_bids = []
service_queue = []
pause_interval = 0

# IMPORTANT - Program sits here for most of its life 
def wait_for_message(sock):
    while True:
        message, (host,port) = sock.recvfrom(2048)

        if message:
            msg = decrypt_message(message)
            try:
                try:
                    print json.loads(msg)
                except:
                    print msg
                choose_path(msg, sock)
            except:
                print msg
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
    msg = json.loads(message)
    if msg['tag'] == "service": service_path(msg, sock)
    elif msg['tag'] == "info":  info_path()
    elif msg['tag'] == "error": error_path()
    elif msg['tag'] == "whois": whois_path()
    elif msg['tag'] == "bid": bid_path(msg)
    elif msg['tag'] == "leds_off": led_path(msg)
    else: return


# main pathway for any service. starts bidding if service exists
def service_path(msg, sock):
    if check_service_exists(msg):
        service_queue.append(msg)
        bidding_timer()
        network.send_multicast_message(
            '{"tag":"bidding","uid":"'+msg['uid']+'","address":"'+self_ip+'"}',ukey,self_ip)
        place_bid(msg['uid'])
        return  
    else:
        network.send_multicast_message(
            '{"tag":"info","message":"service does not exist","address":"'+self_ip+'"}',ukey,self_ip)


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
            bids.append(msg)
            return

#
def led_path(msg):
    services.leds_off()


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


# thread dies after it sends bid to multicast group
def place_bid(uid):
    bid = random.randint(1,100000)
    my_bids.append( (bid,uid) )
    network.send_multicast_message(
        '{"tag":"bid","bid":"'+str(bid)+'","uid":"'+uid+'","address":"'+self_ip+'"}',ukey,self_ip)


# this is started and controls how long the node waits for bids
def thread_bidding_timer():
    TTL = 1
    timeout = time.time()+TTL
    global stop
    while True:
        if(time.time() > timeout):
            stop = True
            network.send_multicast_message(
                '{"tag":"timer"}',ukey,self_ip)#dont delete, cycles bid loop
            finish_bidding()
            break

#
def bidding_timer():
    t = threading.Thread(target=thread_bidding_timer)
    t.start()


# after the nodes have collected bids, this function finishes the
#   process and calls the service function if node wins
# my_bids [(bid,uid)]
# for each service in queue go through bids and make
#   list of bids that go with service uid. then check
#   max bid on that list against self bid for service
def finish_bidding():
    try:
        tmp = []
        for s in service_queue:
            del tmp[:]
            for b in bids:
                if s['uid'] == b['uid']:
                    tmp.append(b['bid']) 
            for m in my_bids:
                if s['uid'] == m[1]:
                    if(str(m[0]) >= max(tmp)):
                        print "\tWON"
                        network.send_multicast_message(
                            '{"tag":"winner","address":"'+self_ip+'","service":"'+
                            s['service']+'"}',ukey,self_ip)
                        services.run_service(s,ukey,self_ip)
                        service_queue.remove(s)
                        my_bids.remove(m) 
    except:
        pass
    finally:
        network.send_multicast_message(
            '{"tag":"waiting","address":"'+self_ip+'"}',ukey,self_ip)

#
def slow_down():
    time.sleep(pause_interval)

#
def set_pause_interval(x):
    pause_interval = x


# send out "stop" message to stop tcp message
#   when ctrl z signal comes in
def stop_tcp_server():
    network.send_tcp_message(self_ip,"stop")


#
def handle_crtl_c(signal, frame):
    print "\nSIGNAL: ctrl c"
    stop_tcp_server()
    sys.exit(0)


# starts multicast, starts tcp server, and then starts listening for multicast messages
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
        network.send_multicast_message("error, ERROR - main failed: "+self_ip,self_ip)


signal.signal(signal.SIGINT, handle_crtl_c)
if __name__ == "__main__":
    main()
