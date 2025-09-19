# creating base image
FROM node:current-slim

# declaring the working directory
WORKDIR /nodeapp

# copying the file in docker image
COPY . .

# installing the dependencies
RUN npm install 

# Exposing the port number
EXPOSE 8000

# Runnig the application
CMD ["node","server.js"]
