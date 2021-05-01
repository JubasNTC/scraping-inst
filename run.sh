#!/bin/bash

if [ ! -d "./node_modules" ] 
then
  npm i
fi

npm run worker
npm start
