
import rous.utils.utils as utils


def test_node_dicovery():
	lst = utils.discover_nodes()
	utils.write_to_whitelist(lst)


def test_find_ip():
	print utils.find_my_ip()



test_node_dicovery()
#test_find_ip()