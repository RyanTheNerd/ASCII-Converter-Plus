#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import requests
from pymongo import MongoClient

client = MongoClient()
db = client.asciiArt
subs = db.subs


# Inheriting from the base server class
class Serv(BaseHTTPRequestHandler):
    def do_GET(self):
        if(self.path == '/'):
            self.path = "/index.html"
        try:
            # [1:] means cut off the forward slash to make the path relative
            file_to_open = open(self.path[1:]).read()
            self.send_response(200)
        except:
            file_to_open = "File not found!"
            self.send_response(404)
            self.end_headers()
        self.wfile.write(bytes(file_to_open, 'utf-8'))
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        print("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
                str(self.path), str(self.headers), post_data.decode('utf-8'))
        subs.insert_one(json.loads(post_data))
        self.wfile.write(bytes("I'm assuming this is the message the client gets in return", 'utf-8'))
httpd = HTTPServer(('', 80), Serv)
httpd.serve_forever()
