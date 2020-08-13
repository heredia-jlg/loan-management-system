'''CRUD operations'''
import os
import pymongo
from p1.user.model import User, Applicant
from p1.data.logger import get_logger
from p1.operations.las import Las
import datetime

log = get_logger(__name__)
las = Las()

try:
    client = pymongo.MongoClient(os.environ.get('MONGO_URI'), ssl=True)
    _db = client['LAS']
except:
    log.exception('Could not connect to Mongo')
    raise
def _get_id():
    '''Retrieves the next id in the database and increments it.'''
    counter = _db.counter.find_one_and_update({'_id': 'UNIQUE_COUNT'},
                                            {'$inc': {'count': 1}},
                                            return_document=pymongo.ReturnDocument.AFTER)['count']
    return counter
def login(username, password):
    '''A function that takes in a username and returns a user object with that username'''
    query_dict = {'username': username}
    user_dict = _db.users.find_one(query_dict)
    if user_dict['password'] == password:
        return User.from_dict(user_dict) if user_dict else None
    else:
        return None
def signup(user_info):
    user = {}
    user['_id'] = _get_id()
    user['firstName'] = user_info[0]
    user['lastName'] = user_info[1]
    user['username'] = user_info[2]
    user['password'] = user_info[3]
    user['address'] = user_info[4]
    user['city'] = user_info[5]
    user['state'] = user_info[6]
    user['income'] = user_info[7]
    user['debt'] = user_info[8]
    user['expenses'] = user_info[9]
    user['user_type'] = 'customer'
    user['risk'] = las.get_risk(user['income'], user['debt'], user['expenses'])
    _db.users.insert_one(user)
def apply(application,user):
    '''Evaluates loan and sets it on database. Returns status of loan'''
    #query
    user_id = user['_id']
    id_query = {"_id": user_id}
    query = {'$push':{"loans": application}}
    _db.users.update_one(id_query, query)
def get_loans():
    query = { "loans": { '$exists': 'true' } }
    loan_list = []
    loan_list = [User.from_dict(user) for user in _db.users.find(query)]
    return loan_list
def actOnLoan(body):
    user_id = int(body.pop())
    loan_id = int(body.pop())
    status = body.pop()
    id_query = { "_id": user_id}
    user = _db.users.find_one(id_query)
    for loan in user['loans']:
        if loan['_id'] == loan_id:
            thisLoan = loan
    thisLoan['status'] = status 
    query = {"_id": user_id}
    _db.users.replace_one(query, user)
    return user
    