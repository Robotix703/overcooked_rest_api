From node:20.11.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN node -v
RUN npm -v
RUN npm install typescript -g

COPY . .
RUN tsc --project ./

EXPOSE 3000

CMD ["npm", "start"]