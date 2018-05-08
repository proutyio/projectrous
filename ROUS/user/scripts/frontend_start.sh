#!/bin/bash

echo Starting ROUS Frontend
chromium-browser --start-fullscreen --new-window "http://localhost:3000" &
cd ~/Workspace/ROUS/user/react_frontend/
BROWSER=none npm start


