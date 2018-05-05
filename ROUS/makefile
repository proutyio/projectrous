
all: 
	@echo "Option 1: make node"
	@echo "Option 2: make user"
	@echo "Option 3: make admin"
	@echo "Option 4: make test_node"
	@echo "Option 5: make test_user"
	@echo "Option 6: make test_admin"
	@echo "Option 7: make test"
	@echo "Option 8: make clean"


node: node/node.py
	python -m node.node


user: user/user.py
	python -m user.user


# admin: admin/admin.py
# 	python -m admin.admin


test_node: test/test_node.py
	python -m test.test_node


# test_user: test/test_user.py
# 	python -m test.test_user


test_admin: test/test_admin.py
	python -m test.test_admin


test: test/test.py
	python -m test.test


clean:
	rm -f *.pyc
	rm -f node/*.pyc
	rm -f user/*.pyc
	rm -f admin/*.pyc
	rm -f utils/*.pyc
	rm -f utils/*.txt
	rm -f test/*pyc
	rm -f rous.log
	rm -rf user/node_modules
