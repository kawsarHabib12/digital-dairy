# Multi-stage Dockerfile for MemoAI Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native compilation (sqlite3 / better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY tsconfig*.json nest-cli.json ./
COPY src/ ./src/

RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache python3 make g++

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Create storage and uploads directories
RUN mkdir -p uploads storage

EXPOSE 3000

CMD ["node", "dist/main.js"]
