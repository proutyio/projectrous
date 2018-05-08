#!/bin/bash

echo Starting ROUS Backend
export FLASK_APP=~/Workspace/ROUS/user/app.py
cd ~/Workspace/ROUS/user/
python -m flask run --host=0.0.0.0 --port=4242
