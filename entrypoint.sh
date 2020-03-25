#!/bin/bash

set -e

[ -z "$ELASTIC_URL" ] && (echo '$ELASTIC_URL must be set' ; exit 1)
[ -z "$VALIDATOR_URL" ] && (echo '$VALIDATOR_URL must be set' ; exit 1)

envsubst '$ELASTIC_URL,$VALIDATOR_URL' \
    < /usr/share/nginx/html/appConfig.js.tpl \
    > /usr/share/nginx/html/appConfig.js

exec "$@"
