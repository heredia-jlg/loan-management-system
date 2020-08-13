'''This module is the start of the application'''
# import external modules
import http.server
import socketserver
# import app modules
from p1.data.logger import get_logger
from p1.web.controller import AppHandler

# Constants
PORT = 8080

# User interface
_log = get_logger(__name__)

with socketserver.TCPServer(('', PORT), AppHandler) as httpd:
    _log.info('Serving on port: %s', PORT)
    httpd.serve_forever()
