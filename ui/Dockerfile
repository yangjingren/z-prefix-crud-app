# Node base image to build off of
FROM node:alphine

# Working directory for app
WORKDIR /app

# Copy all app files from curr dir to filesys of container @ /app
COPY . /app

# Make container accept traffic on port 3000
EXPOSE 3000

# Run shell command at build time
RUN npm install

# Start the app
CMD ["npm", "start"]