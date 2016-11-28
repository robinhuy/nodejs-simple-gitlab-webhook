#!/bin/bash

PROJECT_PATH=$1
CONTAINER_NAME=$2

# Deploy Code to Container
cd $PROJECT_PATH
git pull origin master
docker exec -it $CONTAINER_NAME npm install
docker restart $CONTAINER_NAME
