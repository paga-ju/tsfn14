#FROM node:18.17.1
FROM node:19.9.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY ./src ./src
COPY ./videos ./videos

CMD npm start