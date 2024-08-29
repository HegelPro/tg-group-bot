FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install
ADD . ./
# RUN npm run build

CMD [ "npm", "run", "build:start" ]