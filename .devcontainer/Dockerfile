FROM node:20-alpine3.21
RUN apk update && apk add git openssh 
#go go-doc

ENV GO_VERSION=1.24.0

RUN apk add --no-cache curl git openssh \
 && curl -fsSL https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz \
    | tar -C /usr/local -xz \
 && ln -s /usr/local/go/bin/go /usr/local/bin/go

ENV PATH="/usr/local/go/bin:${PATH}"