FROM node:20-alpine

WORKDIR /app

ENV CI=true

# Copy entire monorepo
COPY . .

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build backend
RUN pnpm --filter backend build

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["node", "dist/apps/backend/src/index.js"]
