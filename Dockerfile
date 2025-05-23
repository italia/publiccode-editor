
FROM node:20-alpine3.21 as build-stage
WORKDIR /app

COPY package*.json ./
COPY . .

RUN apk update && apk add go go-doc
RUN npm install
RUN npm run build

FROM nginx:alpine as run-stage
WORKDIR /app
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
