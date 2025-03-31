FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force 

RUN npm rebuild bcrypt # Add this line

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]