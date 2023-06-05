# Base on the latest node-alpine image
FROM node:current-alpine as build

RUN apk update && apk upgrade && \
    adduser -D svelteuser
USER svelteuser

WORKDIR /usr/src/app

COPY --chown=svelteuser:svelteuser maptool/ /usr/src/app

RUN npm install && \
    npm run build

FROM node:current-alpine

RUN apk update && apk upgrade && \
    apk add dumb-init && \
    adduser -D svelteuser
USER svelteuser

WORKDIR /app

COPY --chown=svelteuser:svelteuser --from=build /usr/src/app/build .
COPY --chown=svelteuser:svelteuser --from=build /usr/src/app/package.json .
COPY --chown=svelteuser:svelteuser --from=build /usr/src/app/package-lock.json .
COPY --chown=svelteuser:svelteuser --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=svelteuser:svelteuser --from=build /usr/src/app/.env .

EXPOSE 8080

ENV HOST=0.0.0.0 PORT=8080 NODE_ENV=production

CMD ["dumb-init","node","-r", "dotenv/config", "index.js"]