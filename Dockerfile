# === STAGE 1: THE CONSTRUCTION SITE ===
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
# postinstall hook ("sync:dice-assets") needs scripts/ present before npm ci
COPY scripts/ ./scripts/
RUN npm ci
COPY . .
RUN npm run build

# === STAGE 2: THE SECURE RUNTIME ===
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
