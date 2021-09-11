FROM node as buildFront

WORKDIR /build/front

COPY ./front/ /build/front

RUN yarn install --dev
RUN yarn build


FROM node as buildServer

WORKDIR /build/

COPY package.json package-lock.json tsconfig.json yarn.lock /build/

RUN yarn install --dev
COPY ./src /build/src
RUN yarn tsc

FROM node

WORKDIR /app

COPY package.json package-lock.json tsconfig.json yarn.lock /app/

RUN yarn install --production

COPY --from=buildServer /build/dist /app
COPY --from=buildFront /build/front/dist /app/front

CMD node_modules/.bin/typeorm migration:show && node_modules/.bin/typeorm migration:run && node .
