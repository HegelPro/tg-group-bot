FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install
ADD . ./
# RUN npm run build
RUN npm run prisma:generate

CMD [ "npm", "run", "build:start" ]