from Crypto.Cipher import AES
from Crypto import Random
import sys, json


def decrypt(message, key):
	iv = Random.new().read(AES.block_size)
	cipher = AES.new(read_key(key), AES.MODE_CFB, iv)
	msg = cipher.decrypt(message.decode("hex"))
	return msg[len(iv):]


def read_key(key):
	try:
		f = open(key, 'r') 
		return f.read() 
	except:
		print "FAILED to read new key from file"


def stdin():
    return sys.stdin.readlines()


def main():
    data = stdin()
    print decrypt(data[0].strip(),json.loads(data[1])['ukey'])


if __name__ == '__main__':
    main()