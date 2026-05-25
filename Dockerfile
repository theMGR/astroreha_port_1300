# Use Node 24 Bullseye for native dependency support
FROM node:24-bullseye

# Install build tools for native modules (swisseph)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 1300
EXPOSE 1300

# Command to run the application
CMD ["npm", "start"]
