FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
    rm -rf /node_modules && \
    npm install
COPY . .
RUN npm run build && \
    npm prune --production

FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
ENV NODE_ENV=prod
CMD npm run start:prod