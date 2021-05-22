#!/bin/bash

# remove before commit
export DJANGO_SETTINGS_MODULE=embark.settings
pip3 install mysqlclient
pip3 install -r requirements.txt

uwsgi --wsgi-file /app/embark/embark/wsgi.py --http :8000 --workers=2 &
daphne embark.asgi:application -p 8001 -b '0.0.0.0'
