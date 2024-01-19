FROM node:18

RUN apt-get update && apt-get install -y

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "main"]

ARG ENV_FILE
ENV ENV_FILE=${ENV_FILE}
COPY ${ENV_FILE} ./.env