''' Maps requests to dispatcher '''
import p1.user.handler as user

_MAP = {
    #TODO
    #'loans': loan.loanDispacher(),
    'users': user.UserDispatcher()
}
_CONTENT = {
    'index': ['static', 'index.html'],
    'login': ['static', 'login.html'],
    'form': ['static', 'form.html'],
    'signup': ['static', 'signup.html'],
    'signedup': ['static', 'signedup.html'],
    'manager': ['static', 'manager.html'],
    'applied': ['static', 'applied.html']
}

def get_dispatcher(context: str):
    '''This function takes in a string "context" and returns the dispatcher associated with it.'''
    if context in _MAP:
        return _MAP[context]
    else:
        return None

def get_static_location(context: str):
    ''' This function takes in a string "context" and returns the file associated with it.'''
    if context in _CONTENT:
        return _CONTENT[context]
    else:
        return None