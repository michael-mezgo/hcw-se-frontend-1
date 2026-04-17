# Stage 1: Build
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code and configuration needed for the build
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template — BACKEND_URL is substituted from ENV at container startup
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy env.js template — runtime env vars (e.g. GOOGLE_MAPS_API_KEY) injected via entrypoint
COPY env.js.template /etc/nginx/env.js.template

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
