# Start from the node base image
FROM node:latest

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (optional for development)
# RUN npm run build

# Command to run the application
CMD ["npm", "run", "dev"]

# Expose port 3000 to the outside world
EXPOSE 3000

