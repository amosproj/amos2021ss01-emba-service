import difflib
import json
import re

import rx
import rx.operators as ops

from channels.generic.websocket import WebsocketConsumer

from inotify_simple import flags
from django.conf import settings
from uploader.models import Firmware
import logging

logger = logging.getLogger('web')


# consumer class for synchronous/asynchronous websocket communication
class WSConsumer(WebsocketConsumer):

    # constructor
    def __init__(self):
        super().__init__()
        self.dummy_map = [{"firmware_id": 1, "module": "module1", "phase": "phase1", "percentage": 0.3}, {"firmware_id": 2, "module": "module2", "phase": "phase2", "percentage": 0.4}]

    # this method is executed when the connection to the frontend is established
    def connect(self):
        # accept socket connection
        self.accept()

    # called when received data from frontend TODO: implement this for processing client input at backend
    def receive(self, text_data=None, bytes_data=None):
        logger.debug(text_data)
        self.send(json.dumps(self.dummy_map, sort_keys=False))

    # called when websocket connection is closed TODO: implement connection close if necessary
    def disconnect(self, close_code):
        pass

    # send data to frontend
    def send_data(self):
        pass


