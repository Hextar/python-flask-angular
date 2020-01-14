import os
import sys
import unittest
 
# folder = os.path.join(os.path.dirname(__file__), "../")
# sys.path.append(folder)

from src import app 
 
class BasicTests(unittest.TestCase):
 
    # executed prior to each test
    def setUp(self):
        app.config['TESTING'] = True
        app.config['DEBUG'] = False
        self.app = app.test_client()

        self.assertEqual(app.debug, False)
 
    # executed after each test
    def tearDown(self):
        pass
 
 	# test main page
    def test_main_page(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
 
 
if __name__ == "__main__":
    unittest.main()