FROM docker.io/node:18 as build-stage

WORKDIR /app

RUN apt-get update \
    && apt-get -y --no-install-recommends install golang-go=2:1.19~1 golang-src=2:1.19~1

COPY . /app

RUN npm ci
RUN npm run build

FROM docker.io/nginx:1
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
