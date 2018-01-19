
import rous.utils.utils as utils


def test_node_dicovery():
	lst = utils.discover_nodes()
	utils.write_to_whitelist(lst)


def test_find_ip():
	return utils.find_my_ip()



# test_node_dicovery()

# ip = test_find_ip()
# print ip 
# print utils.find_ip_from_string(ip)

# import commands
# print commands.getstatusoutput('ip -4 addr | grep -oP ((?<=inet\s)\d+(\.\d+)(3))')


import socket
def get_ip_address():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.connect(("1.1.1.1", 80))
    ip = sock.getsockname()[0]
    sock.close()
    return ip

print get_ip_address()