#!/bin/sh
set -e

# Generate env.js from template using runtime ENV vars
envsubst '${GOOGLE_MAPS_API_KEY}' \
  < /etc/nginx/env.js.template \
  > /usr/share/nginx/html/env.js

# Run the official nginx entrypoint (handles nginx.conf.template → nginx.conf)
exec /docker-entrypoint.sh nginx -g 'daemon off;'
