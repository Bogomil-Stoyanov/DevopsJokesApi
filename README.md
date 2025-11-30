# Jokes API - DevOps Project

A full-stack application built as a DevOps course project, featuring a monorepo structure with Node.js/Express backend and React frontend.

## Architecture

This is a **monorepo** structure containing:

- **Backend** (`/backend`): Express.js REST API serving random programming jokes
- **Frontend** (`/frontend`): React application with Vite and Tailwind CSS
- **Docker Support**: Multi-stage Dockerfiles with security best practices
- **Kubernetes**: Production-ready manifests with autoscaling and ingress
- **CI/CD**: GitHub Actions pipeline with SAST security scanning

## Project Structure

```
DeveopsJokeApi/
├── backend/
│   ├── server.js           # Express server with /api/joke endpoint
│   ├── server.test.js      # Jest unit tests
│   ├── Dockerfile          # Multi-stage production Dockerfile
│   ├── package.json        # Backend dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── JokeCard.jsx    # Main joke display component
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile          # Multi-stage Nginx Dockerfile
│   ├── nginx.conf          # Custom Nginx configuration
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json        # Frontend dependencies
│   └── README.md
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   ├── *-hpa.yaml         # Horizontal Pod Autoscalers
│   └── README.md
├── .github/workflows/
│   └── pipeline.yml        # CI/CD with SAST scanning
├── docker-compose.yml      # Docker Compose configuration
├── k8s-start.sh           # Minikube startup script
├── k8s-stop.sh            # Minikube cleanup script
├── DOCKER.md              # Docker documentation
├── CICD.md                # CI/CD pipeline documentation
├── package.json           # Root package.json with monorepo scripts
└── README.md              # This file
```

## Getting Started

### Prerequisites

**Local Development:**

- Node.js (v18 or higher)
- npm

**Docker (Recommended):**

- Docker Engine 20.10+
- Docker Compose 2.0+

### Installation

#### Option 1: Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

Access the application:

- Frontend: http://localhost
- Backend API: http://localhost:5000

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

#### Option 2: Local Development

Install all dependencies for both backend and frontend:

```bash
npm run install:all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🏃 Running the Application

### Development Mode (Both Services)

Run both backend and frontend concurrently:

```bash
npm run dev
```

This will start:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Individual Services

**Backend only:**

```bash
npm run backend
```

**Frontend only:**

```bash
npm run frontend
```

## 🧪 Testing

Run backend unit tests:

```bash
npm test
```

Or from the backend directory:

```bash
cd backend
npm test
```

## 📡 API Endpoints

### Backend (Port 5000)

- `GET /api/joke` - Returns a random programming joke

  ```json
  {
    "id": 1,
    "joke": "Why do programmers prefer dark mode? Because light attracts bugs!"
  }
  ```

- `GET /health` - Health check endpoint
- `GET /` - Welcome message

## Frontend Features

- **Responsive Design**: Works on desktop and mobile
- **Tailwind CSS**: Modern, utility-first styling
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Auto-fetch**: Loads a joke automatically on mount

## Technology Stack

### Backend

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Jest** - Testing framework
- **Supertest** - HTTP assertions

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Nginx** - Production web server (in Docker)

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Kubernetes** - Container orchestration
- **Alpine Linux** - Minimal base images

## Docker Support

This application is fully containerized with Docker:

- **Multi-stage builds** for optimized image sizes
- **Non-root users** for enhanced security
- **Health checks** for monitoring
- **Docker Compose** for easy orchestration

Quick start:

```bash
docker-compose up -d
```

See [DOCKER.md](./DOCKER.md) for complete Docker documentation.

## Kubernetes Support

Production-ready Kubernetes manifests with:

- **Deployments** with 2 replicas and rolling updates
- **Services** (ClusterIP for backend, LoadBalancer for frontend)
- **Ingress** for routing and load balancing
- **HPA** (Horizontal Pod Autoscaler) for auto-scaling
- **ConfigMaps** for configuration management
- **Resource limits** and health probes

Quick start with Minikube:

```bash
./k8s-start.sh
```

See [k8s/README.md](./k8s/README.md) for complete Kubernetes documentation.  
See [k8s/MINIKUBE.md](./k8s/MINIKUBE.md) for Minikube-specific guide.

## 🚀 CI/CD Pipeline

Automated CI/CD pipeline with comprehensive security scanning:

```bash
# Pipeline automatically runs on:
# - Push to main/master
# - Pull requests
```

**Pipeline stages:**

1. **CI & Testing**: Linting, unit tests
2. **Security Scanning (SAST)**:
   - npm audit (dependency vulnerabilities)
   - CodeQL (static code analysis)
   - Trivy (Docker image scanning)
3. **Build**: Docker images with layer caching
4. **Delivery**: Push to Docker Hub (push to main only)

**Required GitHub Secrets:**

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token

See [CICD.md](./CICD.md) for complete pipeline documentation.

## 📦 DevOps Pipeline Progress

This project implements a complete DevOps pipeline:

- ✅ **Phase 1**: Code Scaffolding
- ✅ **Phase 2**: Docker Containerization
- ✅ **Phase 3**: Kubernetes Deployment
- ✅ **Phase 4**: GitHub Actions CI/CD with SAST Security Scanning

## 🔐 Security Features

CORS is enabled on the backend to allow cross-origin requests from the frontend.

## 📝 Environment Variables

### Frontend

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:5000
```

## 🤝 Contributing

This is a DevOps course project. Contributions are welcome!

## 📄 License

ISC
