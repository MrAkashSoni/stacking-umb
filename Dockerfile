FROM node:16.3.0-alpine3.11 as build-stage

ARG REACT_APP_STAKING_CONTRACT_HADLEY_ETH
ARG REACT_APP_STAKING_CONTRACT_HADLEY_BSC
ARG REACT_APP_STAKING_CONTRACT_POLAR_ETH
ARG REACT_APP_STAKING_CONTRACT_POLAR_BSC
ARG REACT_APP_STAKING_CONTRACT_HADLEY_ETH_PAST_ITERATION_0
ARG REACT_APP_STAGE
ARG REACT_APP_VERSION

RUN apk add --no-cache git

WORKDIR /app

COPY package*.json yarn.lock /app/

RUN yarn install

COPY ./ /app/

RUN yarn build

FROM nginx:1.15

COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
