# Stage 0, "build-stage".
FROM node:8 as build-stage
WORKDIR /app
COPY package*.json /app/
# First install deps, then copy app and build.
RUN yarn install
COPY ./ /app/
RUN yarn run build

# Stage 1, "prod-stage".
FROM nginx:stable
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
