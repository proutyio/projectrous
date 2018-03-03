from Crypto.Cipher import AES
from Crypto import Random


def encrypt(message, key):
	iv = Random.new().read(AES.block_size)
	cipher = AES.new(read_key(key), AES.MODE_CFB, iv)
	msg = iv + cipher.encrypt(message)
	return msg.encode("hex")


def decrypt(message, key):
	iv = Random.new().read(AES.block_size)
	cipher = AES.new(read_key(key), AES.MODE_CFB, iv)
	msg = cipher.decrypt(message.decode("hex"))
	return msg[len(iv):]


def read_key(key):
	# try:
	f = open(key, 'r') 
	return f.read() 
	# except: