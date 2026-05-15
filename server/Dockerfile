FROM node:20-alpine AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
