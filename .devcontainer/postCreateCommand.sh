#!/bin/bash

echo PostCreateCommand
node -v
go version

echo "Install Global Deps"
yarn global add http-server

echo "Install Deps"
yarn