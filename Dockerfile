# === STAGE 1: Build the React static files ===
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === STAGE 2: Node.js Full-Stack Production Runtime ===
FROM node:24-alpine
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled frontend assets and server entrypoint
COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY tsconfig.json ./

# Install tsx globally to run the server entry point
RUN npm install -g tsx

EXPOSE 80
ENV NODE_ENV=production

# Start the Express server which serves both the API and the React SPA
CMD ["npm", "start"]
