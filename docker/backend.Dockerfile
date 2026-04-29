FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm \
	&& pnpm install --frozen-lockfile \
	&& pnpm build

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["node", "dist/index.js"]
