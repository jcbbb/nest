FROM node:18-alpine as base
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm i

COPY . .

ENV NODE_ENV production
RUN pnpm run build

FROM node:18-alpine as production
WORKDIR /usr/src/app

COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package*.json ./
COPY --from=base /usr/src/app/startup.sh ./

RUN chmod +x ./startup.sh 

CMD ["./startup.sh"]
