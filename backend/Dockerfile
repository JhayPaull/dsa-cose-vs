# Use the official Node.js 18 image
FROM node:18-slim

# Install necessary tools for Firebase
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy local code to the container image
COPY . .

# Document that the container listens on port 3001
EXPOSE 3001

# Run the web service on container startup
CMD [ "node", "server.js" ]