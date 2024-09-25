#!/bin/bash

echo PostCreateCommand
node -v
go s

echo "Install Global Deps"
npm i -g http-server

echo "Install Deps"
npm i
