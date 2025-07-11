FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port for development server
EXPOSE 3000

# Start development server with hot-reloading
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
