FROM oven/bun:1.3.8 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock tsconfig.json turbo.json /app/
COPY apps/game-server/package.json /app/apps/game-server/
COPY apps/api/package.json /app/apps/api/
COPY apps/web/package.json /app/apps/web/
COPY packages/shared/package.json /app/packages/shared/

RUN bun install --frozen-lockfile

FROM install AS build
COPY packages/shared /app/packages/shared
COPY apps/game-server /app/apps/game-server

RUN bun run build --filter=@impostor/shared --filter=@impostor/game-server

ENV NODE_ENV=production
ENV PORT=3001

USER bun
EXPOSE 3001
CMD ["bun", "run", "apps/game-server/src/index.ts"]
