FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Or copy pnpm-lock.yaml if using pnpm
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

# Set environment variables for build time if necessary
# ENV NEXT_PUBLIC_API_URL=http://localhost:5000/api

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
