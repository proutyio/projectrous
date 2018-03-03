from Crypto.Cipher import AES
from Crypto import Random

key = 'Sixteen byte key'


def encrypt(key, message):
	iv = Random.new().read(AES.block_size)
	cipher = AES.new(key, AES.MODE_CFB, iv)
	msg = iv + cipher.encrypt(message)
	return msg.encode("hex")


def decrypt(key, message):
	iv = Random.new().read(AES.block_size)
	cipher = AES.new(key, AES.MODE_CFB, iv)
	msg = cipher.decrypt(message.decode("hex"))
	return msg[len(iv):]

emsg = encrypt(key, "message")
print emsg

dmsg = decrypt(key, emsg)
print dmsg
