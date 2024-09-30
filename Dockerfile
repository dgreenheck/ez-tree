# Use an official Node runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Tree.js app
RUN npm run build:app

# Install a simple HTTP server for serving static content
RUN npm install -g http-server

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app when the container launches
CMD ["http-server", "dist"]