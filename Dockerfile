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

# Contenedor final: solo archivos estáticos generados por Vite
COPY --from=build /app/dist ./dist
COPY package.json .

EXPOSE 3000

# Si usas el preview de Vite (vite preview):
CMD ["npm", "run", "preview"]
