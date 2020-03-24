# Stage 0, "build-stage".
FROM node:lts as build-stage
WORKDIR /app
COPY package.json yarn.lock /app/

# First install deps, then copy app and build.
RUN yarn install --frozen-lockfile
COPY ./ /app/
RUN yarn run build-prod

# Stage 1, "prod-stage".
FROM nginx:stable

COPY --from=build-stage /app/src/config/appConfig.js.tpl /usr/share/nginx/html
COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY entrypoint.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]

# https://docs.docker.com/engine/reference/builder/#understand-how-cmd-and-entrypoint-interact
# If CMD is defined from the base image, setting ENTRYPOINT will reset CMD
# to an empty value.
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
