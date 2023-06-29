# Stage 0, "build-stage".
FROM node:lts as build-stage
WORKDIR /app
COPY package*.json /app/

# First install deps, then copy app and build.
RUN npm ci
COPY ./ /app/
RUN npm run build

# Stage 1, "prod-stage".
FROM nginx:1
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
