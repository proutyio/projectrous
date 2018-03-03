from subprocess import call
import commands
import rous.utils.utils as utils


def start_backend():
	filepath = utils.root_path()+"/rous/user/"
	call("node app.js &", cwd=filepath, shell=True)


def start_frontend():
	filepath = utils.root_path()+"/rous/user/react_frontend/"
	call("npm start", cwd=filepath, shell=True)


start_backend()
#start_frontend()