import ConfigParser
import imp
import rous.utils.utils as utils


settings_path = "rous/settings.ini"

#
def config_path(basepath):
	return utils.file_path(basepath)


# returns a config file object
def config_parser(file):
	config = ConfigParser.SafeConfigParser()
	config.read(file)
	return config


# return path of item
def settings(item):
	config = config_parser( config_path(settings_path) )
	for section in config.sections():
		for (name, path) in config.items(section):
			if name == item:
				return path



# scans config file and returns list of all
# 	the services that are defined
configuration = settings("configuration")
def all_services():
	config = config_parser( configuration )
	services = []
	for section in config.sections():
		for (function, file) in config.items(section): 
			if not (function == "file"): 
				services.append(function)
	return services

#
def call_service(service, sender_address):
	config = config_parser( config_path(configuration) )
	for section in config.sections():
		for (function, file) in config.items(section): 
			if(function == service):
				filepath = utils.file_path(file)
				module = imp.load_source(function, filepath)
				call_func = getattr(module, function) #the goods, magic is here
				call_func(sender_address)
				return True
	return False