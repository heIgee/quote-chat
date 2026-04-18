FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the server port
EXPOSE 3000

# Start compiled JavaScript from dist/index.js
CMD ["npm", "start"]
