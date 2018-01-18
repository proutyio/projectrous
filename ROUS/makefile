
all: 
	@echo "Option 1: make node"
	@echo "Option 2: make user"
	@echo "Option 3: make admin"
	@echo "Option 4: make test_node"
	@echo "Option 5: make test_user"
	@echo "Option 6: make test_admin"
	@echo "Option 7: make test"
	@echo "Option 8: make clean"


node: rous/node/node.py
	python -m rous.node.node


user: rous/user/user.py
	python -m rous.user.user


admin: rous/admin/admin.py
	python -m rous.admin.admin


test_node: test/test_node.py
	python -m test.test_node


test_user: test/test_user.py
	python -m test.test_user


test_admin: test/test_admin.py
	python -m test.test_admin


test: test/test.py
	python -m test.test


clean:
	rm -f *.pyc
	rm -f rous/*.pyc
	rm -f rous/node/*.pyc
	rm -f rous/user/*.pyc
	rm -f rous/admin/*.pyc
	rm -f test/*pyc