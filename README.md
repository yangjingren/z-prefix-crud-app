# Getting Started with Z Prefix Crud App

## Available Scripts

In the project directory, you can run:

### `npm docker-compose up --build`

Runs the ui.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\

Runs the api.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\

### `npm docker-compose up -d`

Runs the ui.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\

Runs the api.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\

### `npm docker-compose down`

### `docker-compose ps` 

# To stop the services running in detached mode: 
docker-compose stop 

# View environment variables for the api service:
docker-compose run api env 

# Bring down the services and remove the containers (OPTIONAL: use -v to remove volumes as well):
docker-compose down -v 
