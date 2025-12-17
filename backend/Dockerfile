# Multi-stage Dockerfile for Backend
# Stage 1: Dependencies
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ignore scripts to prevent arbitrary code execution)
RUN npm ci --only=production --ignore-scripts

# Stage 2: Build (for running tests during CI/CD)
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for testing)
RUN npm ci --only=production --ignore-scripts

# Copy source code
COPY . .

# Run tests
RUN npm test

# Stage 3: Production
FROM node:18-alpine AS production

# Install PostgreSQL client for wait script
RUN apk add --no-cache postgresql-client

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from dependencies stage
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Copy and set permissions for entrypoint script
COPY --chown=nodejs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script to run migrations before starting
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
