# === STAGE 1: THE CONSTRUCTION SITE ===
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === STAGE 2: THE SECURE RUNTIME ===
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production
# Install tsx to execute server.ts
RUN npm install -g tsx

# Copy built frontend assets and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/data ./data

EXPOSE 80
ENV NODE_ENV=production

# Start the full-stack server
CMD ["npm", "start"]
