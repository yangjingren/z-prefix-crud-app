# Node base image to build off of
FROM node:alpine

# Working directory for app
WORKDIR /api

# Copy all app files from curr dir to filesys of container @ /app
COPY . /api

# Make container accept traffic on port 3000
EXPOSE 8080

# Run shell command at build time
RUN npm install -g nodemon
RUN npm install

# Start the app
CMD ["npm", "run", "start-dev"]