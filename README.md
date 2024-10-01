<p align="center">
  <img height="200px" src=".github/UmbNetworkLogo.png" />
</p>

# Leo - Staking Portal

## Status DEVELOP

- `leo-dev`: ![leo-dev](https://argocd.dev.umb.network/api/badge?name=leo-dev-eth01&revision=true)

## Status PROD

[![ci](https://github.com/umbrella-network/leo/actions/workflows/cicd.yml/badge.svg?branch=main)](https://github.com/umbrella-network/leo/actions/workflows/cicd.yml)

- `leo`: ![leo](https://argocd.umb.network/api/badge?name=leo-eth01&revision=true)

## Description

Leo allows users to easy participate in Umbrella's Staking process by staking, withdrawing and keeping track of rewards.

## Setup

```sh
$ cp .env-example .env
```

Fill in `.env` with the required environment variables:

```
AWS_REPOSITORY=             //for local deploy only
REACT_APP_STAKING_CONTRACT_HADLEY_ETH= //ex: 0x1a2b3c4c3b2a1
REACT_APP_STAKING_CONTRACT_HADLEY_BSC= //ex: 0x1a2b3c4c3b2a1
REACT_APP_STAKING_CONTRACT_POLAR_ETH= //ex: 0x1a2b3c4c3b2a1
REACT_APP_STAKING_CONTRACT_POLAR_BSC= //ex: 0x1a2b3c4c3b2a1
REACT_APP_STAGE=            //ex: dev
REACT_APP_VERSION=          //ex: 1.5.0

```

## Running

At the root of the folder:

```sh
$ yarn install

$ yarn start
```

or, if you're using npm:

```sh
$ npm install

$ npm start
```

You can also run it using docker:

```sh
$ docker-compose up
```

## Deploy

### Production

Deployment is automatically handled through CI/CD by setting `prod` TAG to a commit.

### Development

Deployment needs to be done locally. You'll need to set correctly the AWS repository in `.env`, and then run:

```sh
make dev
```

or, if you're using a M1 Macbook:

```sh
make dev-m1
```

## Preview

### Web

<img src=".github/screenshots/main_1.png" width="100%" />

---

<img src=".github/screenshots/main_2.png" width="100%" />

---

<img src=".github/screenshots/main_3.png" width="100%" />

---

<img src=".github/screenshots/main_4.png" width="100%" />

---
