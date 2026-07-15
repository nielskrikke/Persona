# === STAGE 1: Build the Static Frontend ===
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === STAGE 2: Secure Production Runtime ===
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies to keep the image lightweight
RUN npm ci --omit=dev
# Copy compiled static client files
COPY --from=builder /app/dist ./dist
# Copy backend files and data folders required by server.ts
COPY server.ts ./
COPY data ./data

# Expose port 3000
EXPOSE 80
ENV NODE_ENV=production

# Start the Node.js Express server which handles both /api and static routes
CMD ["npm", "start"]
