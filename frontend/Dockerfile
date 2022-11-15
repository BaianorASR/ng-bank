FROM node:lts as dependencies
WORKDIR /ngbank/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /ngbank/app
COPY . .
COPY --from=dependencies /ngbank/app/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /ngbank/app
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /ngbank/app/next.config.js ./
COPY --from=builder /ngbank/app/public ./public
COPY --from=builder /ngbank/app/.next ./.next
COPY --from=builder /ngbank/app/node_modules ./node_modules
COPY --from=builder /ngbank/app/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]