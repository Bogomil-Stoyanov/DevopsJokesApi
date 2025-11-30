#!/bin/bash
# Start Jokes API on Minikube

set -e

echo "Starting Jokes API on Kubernetes..."

# Check if minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo "⚠️  Minikube is not running. Starting Minikube..."
    minikube start
    
    echo "Enabling required addons..."
    minikube addons enable ingress
    minikube addons enable metrics-server
fi

# Check if application is deployed
NEEDS_REBUILD=false
if ! kubectl get svc frontend-service -n jokes-api > /dev/null 2>&1; then
    echo "Deploying application..."
    ./k8s/deploy.sh
    NEEDS_REBUILD=true
else
    echo "✅ Application already deployed"
    
    # Check if pods are running
    RUNNING_PODS=$(kubectl get pods -n jokes-api --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l)
    if [ "$RUNNING_PODS" -lt 4 ]; then
        echo "⚠️  Some pods are not running. Will rebuild..."
        NEEDS_REBUILD=true
    fi
fi

if [ "$NEEDS_REBUILD" = true ]; then
    echo "🔨 Building Docker images with correct API URL..."
    eval $(minikube docker-env)
    
    # Build backend
    docker build -t jokes-api-backend:latest ./backend
    
    # Build frontend with localhost:5000 for tunnel access
    echo "📦 Building frontend (API URL: http://localhost:5000)..."
    cd frontend
    VITE_API_URL=http://localhost:5000 npm run build
    cd ..
    docker build -t jokes-api-frontend:latest ./frontend
    
    echo "♻️  Restarting pods to load new images..."
    kubectl delete pods --all -n jokes-api 2>/dev/null || true
    
    echo "⏳ Waiting for pods to be ready..."
    kubectl wait --for=condition=ready pod -l app=jokes-api -n jokes-api --timeout=120s
fi

echo ""
echo "🌐 Starting service tunnels..."
echo ""

# Start backend tunnel in background
echo "🔧 Starting backend tunnel on port 5000..."
kubectl port-forward -n jokes-api svc/backend-service 5000:5000 > /dev/null 2>&1 &
BACKEND_PID=$!

# Give it a moment to start
sleep 2

echo "Starting frontend tunnel..."
echo ""
echo "The tunnel will start and open your browser."
echo "   Keep this terminal open while using the app."
echo "   Press Ctrl+C to stop."
echo ""

# Start the frontend service tunnel (this will block)
minikube service frontend-service -n jokes-api

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null || true
