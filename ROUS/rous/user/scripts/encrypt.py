from Crypto.Cipher import AES
from Crypto import Random
import sys, json


def encrypt(message, key):
	iv = Random.new().read(AES.block_size)
	cipher = AES.new(read_key(key), AES.MODE_CFB, iv)
	msg = iv + cipher.encrypt(message)
	return msg.encode("hex")


def read_key(key):
	try:
		f = open(key, 'r') 
		return f.read() 
	except:
		print "FAILED to read key from file"


def stdin():
    return json.loads(sys.stdin.readlines()[0])


def main():
    data = stdin()
    print encrypt(data['message'],data['ukey'])


if __name__ == '__main__':
    main()