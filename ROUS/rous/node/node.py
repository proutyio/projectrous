import socket
import sys
import logging as log

from .. import config


host = 'localhost'
port = 5000
server_address = (host, port)

exit = False







# Setup socket and bind to server address
# Server listens for message from other nodes
def start_server():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        log.info("Starting server:%s ",server_address)
        sock.bind(server_address)
    except:
        log.error("Failed to start server:%s",server_address)
    return sock




# This function will live in a while loop and waits to receive a messge
def wait_for_message(sock):
    log.info("Server:%s - waiting to receive message", server_address)
    try:
        data, address = sock.recvfrom(4096)
        log.info("Server:%s - received %s from %s",server_address,(data,len(data)),address)
        if data:
        
            # need to enter switch statement now
            parse_message(data)
        
            sent = sock.sendto(data, address)
            log.info('Sent return message: %s back to %s', sent, address)   
    except (KeyboardInterrupt,RuntimeError):
            log.error("Server:%s - sock.recvfrom had an error",server_address)
            exit = True




def parse_message(msg):
    if(msg == "quit"):
        exit = True


    services = { 
    }






def run_service():
    pass




def send_message():
    pass




def main():
    config.setup_logger()
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
