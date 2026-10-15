# Prisma's query engine needs OpenSSL, which node:alpine doesn't ship
FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Install dependencies
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# 2. Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Test suite (docker-compose.test.yml): full sources, dev dependencies and
# Python for the reference-solution tests. Not used by the production image.
FROM base AS test
RUN apk add --no-cache python3
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
CMD ["sh", "scripts/test.sh"]

# 3. Production runner
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/prisma ./prisma
# The seed script reads the problem corpus from src/content
COPY --from=builder /app/src/content ./src/content

EXPOSE 3000
CMD ["npm", "start"]
