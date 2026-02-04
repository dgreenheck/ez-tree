# Use an official Bun runtime as the base image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb (or bun.lock)
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Tree.js app
RUN bun run build

# Install a simple HTTP server for serving static content
RUN bun add -g http-server

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app when the container launches
CMD ["http-server", "dist"]
