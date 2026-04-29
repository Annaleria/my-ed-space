FROM node:20-alpine AS build

WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:alpine

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
