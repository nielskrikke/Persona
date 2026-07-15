# === SINGLE STAGE: NODE RUNTIME ===
FROM node:24-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Build frontend and compile the server
RUN npm run build

# Expose the Express server port
EXPOSE 80
ENV NODE_ENV=production

# Start the full-stack server
CMD ["npm", "start"]
