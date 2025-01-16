FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY frontend/ .

# For development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]