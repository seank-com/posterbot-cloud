FROM node:11-alpine as base

RUN apk update && apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

RUN mkdir /www
WORKDIR /www
RUN chown -R root:node /www

FROM base as builder

COPY package*.json ./

RUN npm install

COPY src/ src/

FROM base AS release

COPY --from=builder /www .

RUN mkdir /www/data
RUN chown -R node:node /www/data

ENV NODE_ENV=production

EXPOSE 4000

USER node

CMD ["node", "src/app.js"]
