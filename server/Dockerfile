FROM node:20-alpine
WORKDIR /app

# install gcc
RUN apk add --update build-base

# install python3
RUN apk add --update python3

COPY package*.json ./
RUN npm install 
COPY . .

EXPOSE 8000

CMD ["node","index.js"];
# CMD ["npm", "start"]