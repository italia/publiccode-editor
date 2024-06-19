
FROM node:20-alpine3.19 as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN apk update && apk add go go-doc
RUN mkdir -p $(go env GOROOT)/misc/wasm
RUN cp  /usr/share/doc/go/misc/wasm/wasm_exec.js  $(go env GOROOT)/misc/wasm/wasm_exec.js


RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "dev"]

#FROM nginx:alpine
#WORKDIR /app
#COPY --from=build-stage /app/dist/ /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
