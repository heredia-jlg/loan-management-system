''' A handler serving as the front controller of our application '''
# External Modules
from http.server import SimpleHTTPRequestHandler
import json
# Internal Modules
from p1.data.logger import get_logger
from p1.web.mapper import get_dispatcher, get_static_location
from os import path
from p1.data.session import session

_FILE_PATH = path.dirname(path.abspath(__file__))
_STATIC_PATH = path.join(path.dirname(_FILE_PATH),('static'))
_MIME_DICT = {
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json'
    
}

_log = get_logger(__name__)

class AppHandler(SimpleHTTPRequestHandler):
    '''A handler for http methods on our server'''
    def do_GET(self):
        '''Handles a GET request to the server'''
        _log.debug('Handling a GET request')
        self.do_controller('GET')
    def do_POST(self):
        '''Handles a POST request to the server'''
        _log.debug('Handling a POST request')
        self.do_controller('POST')
    def do_PUT(self):
        '''Handles a PUT request to the server'''
        _log.debug('Handling a PUT request')
        self.do_controller('PUT')
    def do_DELETE(self):
        '''Handles a DELETE request to the server'''
        _log.debug('Handling a DELETE request')
        self.do_controller('DELETE')
    def do_controller(self, method):
        '''Handles a Get request to the server'''
        _log.debug(self.path) #self.path represents a URI that was requested from the server.
        destination = self.path[1:].split('/')
        if not destination[-1]:
            destination = destination[:-1]
        if len(destination) > 0:
            context = destination[0]
            dispatcher = get_dispatcher(context)
            if dispatcher:
                # rfile is the input from the client (body of the request)
                # destination is the path of the request
                req_string = None
                response_tuple = None
                if 'Content-Length' in self.headers:
                    try:
                        req_string = self.rfile.read(int(self.headers['Content-Length']))
                    except:
                        _log.exception('Could not read request body')
                        self.custom_send_response(400, b'Request not understood by server.')
                    else:
                        response_tuple = dispatcher.dispatch(destination, method, r_body=req_string)
                else:
                    response_tuple = dispatcher.dispatch(destination, method)
                
                # If dispatcher returns 3
                if len(response_tuple) == 3:
                    self.custom_send_response(response_tuple[0],
                                              response_tuple[1], response_tuple[2])
                # If dispatcher returns 2
                elif len(response_tuple) == 2:
                    self.custom_send_response(response_tuple[0], response_tuple[1])
                else:
                    self.custom_send_response(400, b'Request not understood by server.')
                return
            # If dispatcher doesn't pick up a non-get
            elif method != 'GET':
                self.custom_send_response(405, b'Method not allowed')
            # Static Locations
            elif get_static_location(context):
                self.retrieve_static_resource(get_static_location(context))
            # Static Content
            elif context == 'static':
                self.retrieve_static_resource(destination)
            else:
                self.custom_send_response(404, bytes('Resource not found', 'utf-8'))
                return
    def custom_send_response(self, status: int, body: bytes, content_type='text/html'):
        '''Takes in a status code and a request body and writes them to the response'''
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.end_headers()
        self.wfile.write(body)

    def retrieve_static_resource(self, destination: list):
        '''Takes in a list of paths and writes the resulting static file to the response'''
        file_path = _STATIC_PATH
        for part in destination[1:]:
            file_path = path.join(file_path, part)
        if destination[1] in _MIME_DICT:
            self.send_file(file_path, text_type=_MIME_DICT[destination[1]])
        else:
            self.send_file(file_path)
    
    def send_file(self, file_path: str, text_type='text/html'):
        '''Takes in a file_path as a string, checks to see if it's valid,
           writes the file to response or sends 404 if not valid '''
        if path.exists(file_path):
            value = open(file_path, 'rb').read()
            _log.debug(text_type)
            self.custom_send_response(200, value, content_type=text_type)
        else:
            self.custom_send_response(404, bytes('File not found'))


            
if __name__ == '__main__':
    _log.debug(_file_path)
    _file_path = path.join(path.dirname(_file_path),('static'))
    _log.debug(_file_path)
    _log.debug(path.exists(_file_path))