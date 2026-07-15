FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 80
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=80
CMD ["npm", "start"]

