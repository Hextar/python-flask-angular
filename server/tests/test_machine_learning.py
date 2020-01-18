import os
import sys
import pytest
import pickle
import logging as log


TEST_LR_MODEL = './engine/model/test_lr_model.sav'

def test_save_model(app_context, machine_learning):
	# save the model to disk
	machine_learning.save_model({}, TEST_LR_MODEL)			
	
def test_load_model(app_context, machine_learning):
	# save the model to disk
	machine_learning.save_model({}, TEST_LR_MODEL)			
	lr = machine_learning.load_model(TEST_LR_MODEL)			
	assert lr is not None

def test_train_lr_model(app_context, machine_learning):
	lr = machine_learning.train_lr_model(1)