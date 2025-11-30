# Docker Configuration for Jokes API

This directory contains Docker configuration files for containerizing the Jokes API application.

## Docker Files

### Backend

- **Dockerfile**: Multi-stage build with security best practices
  - Stage 1: Install production dependencies
  - Stage 2: Run tests (useful for CI/CD)
  - Stage 3: Production image with non-root user
- **.dockerignore**: Excludes unnecessary files from Docker context

### Frontend

- **Dockerfile**: Multi-stage build with Nginx
  - Stage 1: Build React app with Vite
  - Stage 2: Serve with Nginx Alpine (non-root user)
- **nginx.conf**: Custom Nginx configuration with security headers
- **.dockerignore**: Excludes unnecessary files from Docker context

## Quick Start

### Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes and cleanup
docker-compose down -v
```

### Build Individual Images

**Backend:**

```bash
cd backend
docker build -t jokes-api-backend:latest .
docker run -p 5000:5000 jokes-api-backend:latest
```

**Frontend:**

```bash
cd frontend
docker build -t jokes-api-frontend:latest .
docker run -p 80:80 jokes-api-frontend:latest
```

## Ports

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:80 (or just http://localhost)

## 🔒 Security Features

### Backend

- ✅ Multi-stage build to reduce image size
- ✅ Non-root user (`nodejs:1001`)
- ✅ Production-only dependencies
- ✅ Health check endpoint
- ✅ Minimal attack surface

### Frontend

- ✅ Multi-stage build (build + serve)
- ✅ Nginx Alpine (minimal base image)
- ✅ Non-root user (`nginx-app:1001`)
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Health check endpoint

## Health Checks

Both services include health checks:

**Backend:**

```bash
curl http://localhost:5000/health
```

**Frontend:**

```bash
curl http://localhost/health
```

**Docker health status:**

```bash
docker ps
```

## 🔧 Environment Variables

### Backend

Create `.env` file in backend directory:

```
NODE_ENV=production
PORT=5000
```

### Frontend

The frontend is built with the API URL at build time:

```
VITE_API_URL=http://localhost:5000
```

## 📊 Docker Compose Services

The `docker-compose.yml` defines:

1. **backend**: Express.js API server

   - Port: 5000
   - Network: jokes-network
   - Restart policy: unless-stopped

2. **frontend**: Nginx serving React app
   - Port: 80
   - Depends on: backend (waits for health check)
   - Network: jokes-network
   - Restart policy: unless-stopped

## 🧪 Testing

To run tests during build:

```bash
docker build --target build -t jokes-api-backend:test ./backend
```

## 📦 Image Sizes

The multi-stage builds keep images small:

- Backend: ~150MB (Node Alpine + production deps)
- Frontend: ~25MB (Nginx Alpine + static files)

## 🔍 Debugging

**View backend logs:**

```bash
docker-compose logs -f backend
```

**View frontend logs:**

```bash
docker-compose logs -f frontend
```

**Execute commands in running container:**

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

**Inspect networks:**

```bash
docker network inspect jokes-network
```

## Troubleshooting

**Port already in use:**

```bash
# Change ports in docker-compose.yml
ports:
  - "8080:80"  # frontend
  - "5001:5000"  # backend
```

**Cannot connect to backend from frontend:**

- Ensure both services are on the same network
- Check health checks are passing
- Verify API_URL is correctly set during build

**Permission denied errors:**

- Both images run as non-root users
- Volume mounts may require proper permissions

## CI/CD Integration

These Dockerfiles are designed for CI/CD pipelines:

- Multi-stage builds optimize layer caching
- Test stage runs unit tests
- Security: non-root users, minimal base images
- Health checks for deployment validation
