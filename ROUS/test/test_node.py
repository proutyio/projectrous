import rous.node.node as node




def test_extracting():
	message = ("info,complex_service,test,test,test",("t1","t2"))

	print node.extract_tag(message)
	print node.extract_message(message)
	print node.extract_parameters(message)

test_extracting()









# def test_services():
# 	message = "led:blink:green\n"

# 	msg_lst = node.parse_message(message)
# 	if node.check_service_exists(msg_lst):
# 		node.run_service(msg_lst)


# test_services()


# import test

# test.print_file("m.txt")


