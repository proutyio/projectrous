import socket
import sys
import logging as log

import rous.config
import rous.services


host = 'localhost'
port = 5000
server_address = (host, port)

exit = False


# Setup socket and bind to server address
def start_server():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        log.info("Starting server:%s ",server_address)
        sock.bind(server_address)
    except:
        log.error("Failed to start server:%s",server_address)
    return sock



# This function will live in a while loop and waits to receive a messge
# When it recieves a message it then checks what it should do then will
#   send a reply
def wait_for_message(sock):
    log.info("Server:%s - waiting to receive message", server_address)
    try:
        message, address = sock.recvfrom(4096)
        log.info("Server:%s - received %s from %s",server_address,(message,len(message)),address)
       
        if message:
        
            msg_lst = parse_message(message)
            run_service(msg_lst)
        
            # sent = sock.sendto(message, address)
            # log.info('Sent return message: %s back to %s', sent, address)   
  
    except(KeyboardInterrupt,RuntimeError):
            log.error("Server:%s - sock.recvfrom had an error",server_address)
            exit = True



# breaks message by newline into list then splits
#   by : to break list into sublists
def parse_message(message):
    msg_lst = message.split()
    return [line.split(":") for line in msg_lst]



# Grabs services from services module. Checks if
#   service is in passed in list
def check_service_exists(msg_lst):
    services = rous.services.all_services()

    for s in services:
        if(msg_lst[0][0] == s):
            return True
    return False




#
def run_service():
    pass



#
def send_message():
    pass



#
def main():
    rous.config.setup_logger()
    sock = start_server()
    

    # Main loop that waits from messages from other nodes
    while True:
        try:
            wait_for_message(sock)

            if not exit:
                log.error("Server:%s - shutting down",server_address)
                break

        except(KeyboardInterrupt,RuntimeError):
            log.error("Server:%s - main loop failure",server_address)
            log.error("Exiting..")
            sys.exit()




if __name__ == "__main__":
    main()