import os
import sys
import pytest
import logging as log

''
def test_save_model(app_context, machine_learning, model_path):
	# save the model to disk
	machine_learning.save_model(lr={}, model_path=model_path)
	# then load the model from disk	
	lr = machine_learning.load_model(model_path=model_path)			
	assert lr is not None

def test_save_model_fail_to_save(app_context, machine_learning, model_path):
	# save the model to disk
	try:
		os.remove(model_path)
		machine_learning.save_model(model_path=model_path)		
	except:
		pass
	# then load the model from disk	
	lr = machine_learning.load_model(model_path=model_path)			
	assert lr is None		
	
def test_load_model(app_context, machine_learning, model_path):
	# save the model to disk
	machine_learning.save_model(lr={}, model_path=model_path)		
	# then load the model from disk	
	lr = machine_learning.load_model(model_path=model_path)
	log.info("==============>", lr)	
	assert lr is not None

def test_train_lr_model(app_context, machine_learning, model_path):
	lr = machine_learning.train_lr_model(1)
	pass