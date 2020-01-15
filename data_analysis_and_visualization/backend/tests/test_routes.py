import os
import sys
 
# folder = os.path.join(os.path.dirname(__file__), "../")
# sys.path.append(folder)

def test_home(client):
	"""homepage is working"""

	r = client.get('/')
	r.status == '200'