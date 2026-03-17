FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm install typescript

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]