
all: 
	@echo "Option 1: make node"
	@echo "Option 2: make user"


node: rous/node/node.py
	python -m rous.node.node


user: rous/user/user.py
	python -m rous.user.user


clean:
	rm -f *.pyc
	rm -f rous/*.pyc
	rm -f rous/node/*.pyc
	rm -f rous/user/*.pyc
	rm -f rous/admin/*.pyc