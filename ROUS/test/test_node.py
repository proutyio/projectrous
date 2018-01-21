import rous.node.node as node


def test_services():
	message = "led:blink:green\n"

	msg_lst = node.parse_message(message)
	if node.check_service_exists(msg_lst):
		node.run_service(msg_lst)


# test_services()


