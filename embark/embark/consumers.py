import difflib
import json
import re

import rx
import rx.operators as ops

from channels.generic.websocket import WebsocketConsumer

from inotify_simple import flags
from django.conf import settings
from uploader.models import Firmware


# consumer class for synchronous/asynchronous websocket communication
# TODO: Implement frontend Websocket handling and data extraction (Example in progress.html -> remove later)


class WSConsumer(WebsocketConsumer):

    # constructor
    def __init__(self):
        super().__init__()

    # this method is executed when the connection to the frontend is established
    def connect(self):
        # accept socket connection
        # firmware_id = self.scope["url_route"]["kwargs"].get("firmware_id")

        self.accept()

    # called when received data from frontend TODO: implement this for processing client input at backend
    def receive(self, text_data=None, bytes_data=None):
        pass

    # called when websocket connection is closed TODO: implement connection close if necessary
    def disconnect(self, close_code):
        pass

    # send data to frontend
    def send_data(self):
        self.send(json.dumps(self.status_msg, sort_keys=False))

