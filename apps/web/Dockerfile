# Build stage
FROM oven/bun:1.3.8 AS build
WORKDIR /app

# Copy config and workspaces
COPY package.json bun.lock tsconfig.json turbo.json /app/
COPY apps/web/package.json /app/apps/web/
COPY packages/shared/package.json /app/packages/shared/

RUN bun install --frozen-lockfile

# Copy source
COPY packages/shared /app/packages/shared
COPY apps/web /app/apps/web

# Build-time environment variables (Vite requires these to be defined during build)
ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN bun run build --filter=@impostor/web

# Serve stage with Nginx
FROM nginx:alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Default Nginx config for SPAs (History API support)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
