FROM node as buildFront

WORKDIR /build/front

COPY ./front/ /build/front

RUN yarn install --dev
RUN yarn build


# FROM node as buildServer

# WORKDIR /build/

# COPY package.json package-lock.json tsconfig.json yarn.lock /build/

# RUN yarn install --dev
# COPY ./src /build/src
# RUN yarn tsc

FROM node

WORKDIR /app

COPY package.json package-lock.json tsconfig.json yarn.lock ormconfig.json /app/
COPY ./scripts /app/scripts

RUN chmod +x /app/scripts/*

RUN yarn install --production
COPY ./src /app/src
COPY --from=buildFront /build/front/dist /app/front


ENV PATH /app/scripts:$PATH

CMD start
