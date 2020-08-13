'''testing module'''
import unittest
from p1.operations.las import Las as Las
from p1.data.session import session
from p1.user.model import User
import p1.user.handler as handler
import p1.data.mongo as db

las = Las()
user = User()
class testOperations(unittest.TestCase):
    def testValues(self):
        self.assertRaises(ValueError, las.get_risk(0, -1,0))
        self.assertRaises(session)

    def testTypes(self):
        self.addCleanup(las.get_risk(0,0,'d'))

    def testLoanApproval(self):
        application = {"_id":191,"loan_type":"Personal","use":"Wedding","ssn":"12345","status":"","reason":""}
        application1 = {"_id":191,"loan_type":"Mortgage","use":"Wedding","ssn":"12345","status":"","reason":""}
        application2 = {"_id":191,"loan_type":"Student","use":"Wedding","ssn":"12345","status":"","reason":""}
        user = {"_id":158,"firstName":"Manager","lastName":"Managerson","username":"manager","password":"123","address":"123 Here st","city":"Here","state":"AZ","income":"100000","debt":"10000","expenses":"30000","user_type":"manager","risk":"0.20"}
        user1 = {"_id":158,"firstName":"Manager","lastName":"Managerson","username":"manager","password":"123","address":"123 Here st","city":"Here","state":"AZ","income":"100000","debt":"10","expenses":"300","user_type":"manager","risk":"0.20"}
        user2 = {"_id":158,"firstName":"Manager","lastName":"Managerson","username":"manager","password":"123","address":"123 Here st","city":"Here","state":"AZ","income":"1000","debt":"70000","expenses":"30000","user_type":"manager","risk":"0.20"}        
        dictionary = {'_id': '','loan_type': '','reason': '','ssn': '','status': '','use': ''}
        self.addCleanup('',las.evaluate_loan(application, user) )
        self.addCleanup('',las.evaluate_loan(application1, user1) )
        self.addCleanup('',las.evaluate_loan(application2, user2) )
        self.addCleanup('',las.evaluate_loan(application, user2) )
        self.addCleanup('',las.evaluate_loan(application1, user) )
        self.addCleanup('',las.evaluate_loan(application2, user1) )
        self.addCleanup('',las.evaluate_loan(application, user1) )
        self.addCleanup('',las.evaluate_loan(application1, user1) )
        self.addCleanup('',las.evaluate_loan(application2, user2) )
        self.assertRaises(las.get_risk(100000,100000,20000))
        self.assertRaises(las.get_risk(10000,10000,20000))
        self.assertRaises(las.get_risk(10000,100,200))
        

class userTest(unittest.TestCase):
    def testSUser(self, User):
        self.user = None
    def setUp(self):
        self.user = User()
    def tearDown(self):
        self.user = None

class handlerTest(unittest.TestCase):
    def testType(self):
        self.assertEqual(handler, handler)

class mongoTest(unittest.TestCase):
    def testType(self):
        self.assertEqual(handler, handler)
