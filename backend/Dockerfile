FROM node:18.12.1-alpine AS base

WORKDIR /ngbank/app
COPY [ "package*.json", "tsconfig.build.json", "tsconfig.json", "yarn.lock" , "./" ]

FROM base AS dev
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 3001
CMD [ "yarn", "start:dev", "core" ]

FROM base AS prod

RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn global add @nestjs/cli
RUN yarn build
EXPOSE 3001
CMD [ "yarn", "start:prod core" ]