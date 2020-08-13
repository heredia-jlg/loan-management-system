''' A handler for User operations in our server '''

from http.server import SimpleHTTPRequestHandler
import json
import p1.web.dispatch as dispatch
from p1.data import mongo as db
from p1.user.model import UserEncoder
from p1.data.logger import get_logger
from p1.data.session import session as session
from os import path
from p1.operations.las import Las

_log = get_logger(__name__)
las = Las()

class UserDispatcher(dispatch.Dispatcher):
    '''Dispatcher for Users '''
    def dispatch(self, path: list, method, r_body=None):
        '''dispatch takes in path and request body
           returns status code and responee body as tuple '''

        value = None
        _log.debug(r_body)
        if len(path) == 2 and method == 'POST' and path[1] == 'login':
            _log.debug(r_body.decode('utf-8').split('='))
            user = r_body.decode('utf-8').split('=')
            password = user.pop()
            username = user.pop()
            user = db.login(username, password).to_dict()
            if user is not None:
                if user['user_type'] == 'manager':
                    value = bytes(json.dumps('manager', cls=UserEncoder), 'utf-8')
                else:
                    value = bytes(json.dumps('customer', cls=UserEncoder), 'utf-8')
                session.auth = user
                return (200, value, 'json')
            else:
                return (401, b'Unauthorized')
        elif len(path) == 2 and path[1] == 'signup':
            body = r_body.decode('utf-8').split('=')
            db.signup(body)
            value = bytes(json.dumps(body, cls=UserEncoder), 'utf-8')
            return (200, value, 'json')
        elif len(path) == 2 and path[1] == 'apply':
            body = r_body.decode('utf-8').split('=')
            user = session.auth
            application = self.dictionaryFromTouple(body)
            #application evaluation
            application = las.evaluate_loan(application, user)
            db.apply(application, user)
            value = bytes(json.dumps(application['status'], cls=UserEncoder), 'utf-8')
            return (200, value, 'json')
        elif len(path) == 1 and method == 'GET':
            user = session.auth
            username = user['username']
            password = user['password']
            user = db.login(username, password)
            value = bytes(json.dumps(user, cls=UserEncoder), 'utf-8')
            if user is not None:
                return (200, value, 'json')
            else:
                return (401, b'Unauthorized')
        elif len(path) == 2 and method == 'GET' and path[1] == 'getLoans':
            user_list = db.get_loans()
            value = bytes(json.dumps(user_list, cls=UserEncoder), 'utf-8')
            if user_list is not None:
                return (200, value, 'json')
            else:
                return (401, b'Unauthorized')
        elif len(path) == 2 and path[1] == 'actOnLoan':
            body = r_body.decode('utf-8').split('=')
            user = session.auth
            value = db.actOnLoan(body)
            value = bytes(json.dumps(body, cls=UserEncoder), 'utf-8')
            return (200, value, 'json')
        else:
            return (401, b'Unauthorized')
    def dictionaryFromTouple(self,application):
        '''Temporaty fix. Find another way to make code cleaner'''
        if application[0] == 'Student':
            application_dictionary = {}
            application_dictionary['_id'] = int(db._get_id())
            application_dictionary['loan_type'] = application[0]
            application_dictionary['university'] = application[1]
            application_dictionary['graduation'] = application[2]
        elif application[0] == 'Mortgage':
            application_dictionary = {}
            application_dictionary['_id'] = int(db._get_id())
            application_dictionary['loan_type'] = application[0]
            application_dictionary['address'] = application[1]
            application_dictionary['amount'] = application[1]
        elif application[0] == 'Personal':
            application_dictionary = {}
            application_dictionary['_id'] = int(db._get_id())
            application_dictionary['loan_type'] = application[0]
            application_dictionary['use'] = application[1]
            application_dictionary['ssn'] = application[2]
        return application_dictionary

