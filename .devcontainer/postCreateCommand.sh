#!/bin/bash

echo PostCreateCommand
node -v
go s

echo "Install Global Deps"
yarn global add http-server

echo "Install Deps"
yarn
