
FROM node:20-alpine3.19 as build-stage
WORKDIR /app

RUN rm -fr node_modules
RUN mkdir node_modules
RUN rm -fr dist

COPY package*.json ./
COPY . .

RUN apk update && apk add go go-doc
RUN mkdir -p $(go env GOROOT)/misc/wasm
RUN cp  /usr/share/doc/go/misc/wasm/wasm_exec.js  $(go env GOROOT)/misc/wasm/wasm_exec.js

# RUN npm install
RUN yarn config set cache-folder .yarn
RUN yarn install
RUN yarn build
# RUN npm run build
EXPOSE 8080
CMD ["yarn",  "dev"]

#FROM nginx:alpine
#WORKDIR /app
#COPY --from=build-stage /app/dist/ /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
