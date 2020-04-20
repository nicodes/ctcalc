FROM node:13

WORKDIR /usr/src/app/

COPY package*.json ./

CMD node_modules/.bin/nodemon
