# Use official Node.js Alpine image for smaller footprint (Optimization 1: reducing image size)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json (if exists) first to leverage Docker cache
COPY package*.json ./

# Install dependencies (only production to save space)
RUN npm install --production

# Multi-stage build / runtime separation (Optimization 2: separating build/runtime concerns)
FROM node:18-alpine

# Define working directory
WORKDIR /app

# Copy dependencies and application source code
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Expose the correct port
EXPOSE 3000

# Start the application correctly
CMD ["node", "app.js"]
