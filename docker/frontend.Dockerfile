FROM node:20-alpine

WORKDIR /app

ENV CI=true

# Copy entire monorepo
COPY . .

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build frontend
RUN pnpm --filter frontend build

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port 5173"]
