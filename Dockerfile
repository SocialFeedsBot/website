FROM node:14

COPY . /usr/src/
WORKDIR /usr/src/

RUN npm i
RUN npm run build

CMD ["npm run start"]