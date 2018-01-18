import socket
import sys
import logging as log

import services


log_file = "rous.log"
host = 'localhost'
port = 5000
server_address = (host, port)

exit = False



def setup_logger():
    log.basicConfig(filename=log_file,
        format='%(asctime)s::%(levelname)s:: %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p',
        stream=sys.stdout,
        level=log.INFO)




# Server listens for message from other nodes
def start_server():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        log.info("Starting server: %s ",server_address)
        sock.bind(server_address)
    except:
        log.error("Failed to start server: %s",server_address)
    return sock





def receive_message(sock):
    log.info("Server: %s - waiting to receive message", server_address)
    try:
        data, address = sock.recvfrom(4096)
        log.info("Server: %s - received %s from %s",server_address,(data,len(data)),address)
        if data:
        
            # need to enter switch statement now
            parse_message(data)
        
            sent = sock.sendto(data, address)
            log.info('Sent return message: %s back to %s', sent, address)
    except:
        log.error("Server: %s - sock.recvfrom had an error",server_address)





def parse_message(msg):
    if(msg == "quit"):
        exit = True


    services = { 
    }






def run_service():
    pass






def main():
    setup_logger()
    sock = start_server()
    

    # Main loop that waits from messages from other nodes
    while True:
        try:
            receive_message(sock)
            if not exit:
                log.info("Shutting down server: %s",server_address) 
                break
        except:
            log.error("Server: %s - receive message loop failure",server_address)







if __name__ == "__main__":
    main()
