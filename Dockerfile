# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app

# --- Dependencies ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production image ---
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# CRA genera "build", no "dist"
COPY --from=build /app/build ./build

# Para servir los estáticos necesitas "serve"
RUN npm install -g serve

EXPOSE 3000

# Servir la app
CMD ["serve", "-s", "build"]
