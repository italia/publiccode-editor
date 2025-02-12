FROM node:22-alpine3.19
RUN apk update && apk add git openssh go go-doc
RUN mkdir -p $(go env GOROOT)/misc/wasm
RUN cp  /usr/share/doc/go/misc/wasm/wasm_exec.js  $(go env GOROOT)/misc/wasm/wasm_exec.js