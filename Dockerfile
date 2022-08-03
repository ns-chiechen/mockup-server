FROM node:14
# Create app directory
WORKDIR /mockup-server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV DEBUG=mockup-server
CMD [ "npm", "start" ]