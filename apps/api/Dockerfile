# Base image with Bun
FROM oven/bun:1.3.8 AS base
WORKDIR /app

# Install dependencies in a separate stage for caching
FROM base AS install
COPY package.json bun.lock tsconfig.json turbo.json /app/
COPY apps/api/package.json /app/apps/api/
COPY packages/shared/package.json /app/packages/shared/

# Install root and workspace dependencies
RUN bun install --frozen-lockfile

# Copy source and build
FROM install AS build
COPY packages/shared /app/packages/shared
COPY apps/api /app/apps/api

# Run build for the shared package and the API
RUN bun run build --filter=@impostor/shared --filter=@impostor/api

# Environment and start
ENV NODE_ENV=production
ENV PORT=3000

USER bun
EXPOSE 3000
CMD ["bun", "run", "apps/api/src/index.ts"]
