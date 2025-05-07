FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY /prisma ./
RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm install && \
    npx prisma generate
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
ENV NODE_ENV=prod
CMD npx prisma migrate deploy && npx prisma db seed && npm run start:prod