# Stage 0, "build-stage".
FROM node:lts as build-stage
WORKDIR /app
COPY package*.json /app/

# First install deps, then copy app and build.
RUN yarn install
COPY ./ /app/
RUN yarn run build-prod

# Stage 1, "prod-stage".
FROM nginx:stable
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
