#!/bin/bash
# Deploy all Kubernetes resources for Jokes API

set -e

echo "Deploying Jokes API to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl not found. Please install kubectl first."
    exit 1
fi

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Create ConfigMap
echo "Creating ConfigMap..."
kubectl apply -f k8s/configmap.yaml

# Deploy backend
echo "Deploying backend..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Deploy frontend
echo "Deploying frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Deploy Ingress
echo "Deploying Ingress..."
kubectl apply -f k8s/ingress.yaml

# Deploy HPAs
echo "Deploying Horizontal Pod Autoscalers..."
kubectl apply -f k8s/backend-hpa.yaml
kubectl apply -f k8s/frontend-hpa.yaml

echo ""
echo "Deployment complete!"
echo ""
echo "Checking deployment status..."
kubectl get all -n jokes-api

echo ""
echo "To check pod status:"
echo "   kubectl get pods -n jokes-api -w"
echo ""
echo "To view logs:"
echo "   kubectl logs -n jokes-api -l component=backend"
echo "   kubectl logs -n jokes-api -l component=frontend"
echo ""
echo "To access the application:"
echo "   kubectl get svc -n jokes-api"
echo ""
