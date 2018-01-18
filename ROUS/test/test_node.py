import rous.node.node

message = "led:blink:red\nled:blink:green\nprint:black\n"

msg_lst = rous.node.node.parse_message(message)
print rous.node.node.check_service_exists(msg_lst)
