#!/bin/bash

echo PostCreateCommand

echo "NodeJs version"
node -v
echo "GO version"
go version

echo "Set Git hooks"
echo "Set pre-push hook"
cp .devcontainer/githooks/pre-push .git/hooks
chmod +x .git/hooks/pre-push

echo "Install Global Deps"
npm i -g http-server localtunnel

echo "Install Deps"
npm i
