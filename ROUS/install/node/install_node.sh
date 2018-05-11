#!/bin/bash
echo "Installing Node..."

sudo rm -rf ~/ROUS/
sudo mkdir ~/ROUS/

cd ..
sudo cp settings.ini ~/ROUS/
sudo cp __init__.py ~/ROUS/
sudo cp makefile ~/ROUS/
sudo cp -r node/ ~/ROUS/
sudo cp -r utils/ ~/ROUS/

cd utils/
sudo rm -rf keys/
sudo mkdir keys

cd keys/
touch ukey.txt
echo 9d01d52bbdfb4a329eabbd25515d6cec >> ukey.txt

echo "Finished!" 
