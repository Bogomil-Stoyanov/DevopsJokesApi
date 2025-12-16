#!/bin/bash
# Delete all Kubernetes resources for Jokes API

set -e

echo " Removing Jokes API from Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl not found."
    exit 1
fi

# Delete HPAs
echo "Removing Horizontal Pod Autoscalers..."
kubectl delete -f k8s/backend-hpa.yaml --ignore-not-found=true
kubectl delete -f k8s/frontend-hpa.yaml --ignore-not-found=true

# Delete Ingress
echo "Removing Ingress..."
kubectl delete -f k8s/ingress.yaml --ignore-not-found=true

# Delete frontend
echo "Removing frontend..."
kubectl delete -f k8s/frontend-service.yaml --ignore-not-found=true
kubectl delete -f k8s/frontend-deployment.yaml --ignore-not-found=true

# Delete backend
echo "Removing backend..."
kubectl delete -f k8s/backend-service.yaml --ignore-not-found=true
kubectl delete -f k8s/backend-deployment.yaml --ignore-not-found=true

# Delete ConfigMap
echo "Removing ConfigMap..."
kubectl delete -f k8s/configmap.yaml --ignore-not-found=true

# Delete namespace (this will remove everything in the namespace)
echo "Removing namespace..."
kubectl delete -f k8s/namespace.yaml --ignore-not-found=true

echo ""
echo "Cleanup complete!"
echo ""
echo "To verify removal:"
echo "   kubectl get all -n jokes-api"
