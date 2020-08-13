''' contain the abstract class dispatcher '''
from http.server import SimpleHTTPRequestHandler
class Dispatcher():
    ''' Define what a Dispatcher can do '''
    def dispatch(self, path: list, method, r_body=None):
        ''' The dispatch Method takes in a uri path as a list of elements, a request body,
            and a method and returns the status code and body of the response.'''
        return (501, 'Not Implemented')