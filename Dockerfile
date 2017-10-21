FROM node:8.7

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn

COPY . /usr/src/app

ENV PORT 4100
EXPOSE 4100

CMD [ "npm", "start" ]
