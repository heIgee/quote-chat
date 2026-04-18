FROM node:24-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the default Vite port
EXPOSE 5173

# Start the development server and bind to all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
