# Kubernetes Deployment Guide - Jokes API

Complete Kubernetes (K8s) manifests for deploying the Jokes API application to any Kubernetes cluster.

## Kubernetes Manifests

```
k8s/
├── namespace.yaml                      # Namespace isolation
├── configmap.yaml                      # Configuration data
├── backend-deployment.yaml             # Backend deployment (2 replicas)
├── backend-service.yaml                # Backend ClusterIP service
├── backend-hpa.yaml                    # Backend autoscaling
├── frontend-deployment.yaml            # Frontend deployment (2 replicas)
├── frontend-service.yaml               # Frontend LoadBalancer service
├── frontend-service-nodeport.yaml      # Alternative NodePort service
├── frontend-hpa.yaml                   # Frontend autoscaling
├── ingress.yaml                        # Ingress routing
├── deploy.sh                           # Deployment script
└── cleanup.sh                          # Cleanup script
```

## Architecture

### Backend

- **Deployment**: 2 replicas with rolling updates
- **Service**: ClusterIP (internal only)
- **Port**: 5000
- **Resources**:
  - Requests: 100m CPU, 128Mi Memory
  - Limits: 500m CPU, 256Mi Memory
- **Probes**: Liveness and Readiness on `/health`
- **Autoscaling**: 2-10 pods based on CPU/Memory

### Frontend

- **Deployment**: 2 replicas with rolling updates
- **Service**: LoadBalancer (external access)
- **Port**: 80
- **Resources**:
  - Requests: 50m CPU, 64Mi Memory
  - Limits: 200m CPU, 128Mi Memory
- **Probes**: Liveness and Readiness on `/health`
- **Autoscaling**: 2-8 pods based on CPU/Memory

### Ingress

- Routes `/` to frontend
- Routes `/api` to backend
- Routes `/health` to backend
- Can be configured for TLS/HTTPS

## Prerequisites

1. **Kubernetes Cluster** (one of):

   - Minikube (local development)
   - Kind (local development)
   - Docker Desktop Kubernetes
   - Cloud provider (GKE, EKS, AKS)

2. **kubectl** installed and configured

3. **Docker images** built:

   ```bash
   # Build images
   docker-compose build

   # For Minikube, load images directly
   minikube image load jokes-api-backend:latest
   minikube image load jokes-api-frontend:latest
   ```

4. **Ingress Controller** (optional, for Ingress):

   ```bash
   # For Minikube
   minikube addons enable ingress

   # For other clusters, install NGINX Ingress
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
   ```

5. **Metrics Server** (optional, for HPA):
   ```bash
   kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
   ```

## Quick Deployment

### Option 1: Using the Deploy Script (Recommended)

```bash
# Deploy everything
./k8s/deploy.sh

# Check status
kubectl get all -n jokes-api

# Watch pods come up
kubectl get pods -n jokes-api -w
```

### Option 2: Manual Deployment

```bash
# Create namespace and config
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/backend-hpa.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/frontend-hpa.yaml

# Deploy Ingress (optional)
kubectl apply -f k8s/ingress.yaml
```

## Accessing the Application

### Method 1: LoadBalancer (Cloud Providers)

```bash
# Get external IP
kubectl get svc frontend-service -n jokes-api

# Access application
# http://<EXTERNAL-IP>
```

### Method 2: NodePort (Minikube/Local)

```bash
# Use NodePort service instead
kubectl apply -f k8s/frontend-service-nodeport.yaml

# Get Minikube IP
minikube ip

# Access application
# http://<MINIKUBE-IP>:30080
```

### Method 3: Ingress

```bash
# Add to /etc/hosts (on macOS/Linux)
echo "$(minikube ip) jokes-api.local" | sudo tee -a /etc/hosts

# Access application
# http://jokes-api.local
```

### Method 4: Port Forward (Development)

```bash
# Forward frontend
kubectl port-forward -n jokes-api svc/frontend-service 3000:80

# Forward backend
kubectl port-forward -n jokes-api svc/backend-service 5000:5000

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## Monitoring & Debugging

### Check Deployment Status

```bash
# Get all resources
kubectl get all -n jokes-api

# Check pod status
kubectl get pods -n jokes-api

# Describe pod
kubectl describe pod <pod-name> -n jokes-api

# Check events
kubectl get events -n jokes-api --sort-by='.lastTimestamp'
```

### View Logs

```bash
# Backend logs
kubectl logs -n jokes-api -l component=backend -f

# Frontend logs
kubectl logs -n jokes-api -l component=frontend -f

# Specific pod
kubectl logs -n jokes-api <pod-name> -f

# Previous crashed pod
kubectl logs -n jokes-api <pod-name> --previous
```

### Check Services

```bash
# List services
kubectl get svc -n jokes-api

# Describe service
kubectl describe svc backend-service -n jokes-api
kubectl describe svc frontend-service -n jokes-api
```

### Check Ingress

```bash
# Get ingress
kubectl get ingress -n jokes-api

# Describe ingress
kubectl describe ingress jokes-api-ingress -n jokes-api
```

### Check HPA Status

```bash
# Get HPA status
kubectl get hpa -n jokes-api

# Watch HPA
kubectl get hpa -n jokes-api -w

# Describe HPA
kubectl describe hpa backend-hpa -n jokes-api
```

## Testing

### Test Backend

```bash
# Port forward backend
kubectl port-forward -n jokes-api svc/backend-service 5000:5000

# Test endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/joke
```

### Test Frontend

```bash
# Port forward frontend
kubectl port-forward -n jokes-api svc/frontend-service 8080:80

# Open in browser
open http://localhost:8080
```

### Health Checks

```bash
# Check if pods are ready
kubectl get pods -n jokes-api

# All pods should show 1/1 READY and STATUS Running
```

## Updates & Rollouts

### Update Deployment

```bash
# Update image
kubectl set image deployment/backend-deployment backend=jokes-api-backend:v2 -n jokes-api

# Check rollout status
kubectl rollout status deployment/backend-deployment -n jokes-api

# View rollout history
kubectl rollout history deployment/backend-deployment -n jokes-api
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/backend-deployment -n jokes-api

# Rollback to specific revision
kubectl rollout undo deployment/backend-deployment --to-revision=2 -n jokes-api
```

### Restart Deployment

```bash
# Restart without changing anything
kubectl rollout restart deployment/backend-deployment -n jokes-api
kubectl rollout restart deployment/frontend-deployment -n jokes-api
```

## Scaling

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=5 -n jokes-api

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3 -n jokes-api
```

### Autoscaling (HPA)

The HPA manifests automatically scale based on:

- CPU usage > 70%
- Memory usage > 80%

```bash
# Check current HPA status
kubectl get hpa -n jokes-api

# Test autoscaling by generating load
kubectl run -it --rm load-generator --image=busybox -n jokes-api -- /bin/sh
# Then run: while true; do wget -q -O- http://backend-service:5000/api/joke; done
```

## Cleanup

### Using Cleanup Script

```bash
./k8s/cleanup.sh
```

### Manual Cleanup

```bash
# Delete all resources
kubectl delete namespace jokes-api

# Or delete individually
kubectl delete -f k8s/
```

## Security Features

### Pod Security

- ✅ **Non-root user**: Runs as UID 1001
- ✅ **Read-only root filesystem**: Where possible
- ✅ **No privilege escalation**
- ✅ **Capabilities dropped**: All unnecessary capabilities
- ✅ **Security context**: Enforced at pod and container level

### Network Security

- ✅ **ClusterIP for backend**: Not exposed externally
- ✅ **Service isolation**: Namespace-based
- ✅ **Ingress routing**: Controlled external access

### Resource Management

- ✅ **Resource requests**: Guaranteed resources
- ✅ **Resource limits**: Prevent resource exhaustion
- ✅ **Health probes**: Automatic recovery

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n jokes-api

# Describe pod
kubectl describe pod <pod-name> -n jokes-api

# Check logs
kubectl logs <pod-name> -n jokes-api

# Common issues:
# - ImagePullBackOff: Image not available
# - CrashLoopBackOff: Application crashing
# - Pending: Insufficient resources
```

### Service Not Accessible

```bash
# Check service
kubectl get svc -n jokes-api
kubectl describe svc <service-name> -n jokes-api

# Check endpoints
kubectl get endpoints -n jokes-api

# Test from within cluster
kubectl run test-pod --image=busybox -n jokes-api -it --rm -- wget -qO- http://backend-service:5000/health
```

### Ingress Not Working

```bash
# Check ingress controller is running
kubectl get pods -n ingress-nginx

# Check ingress
kubectl describe ingress jokes-api-ingress -n jokes-api

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### HPA Not Scaling

```bash
# Check metrics server
kubectl get deployment metrics-server -n kube-system

# Check HPA
kubectl describe hpa <hpa-name> -n jokes-api

# Check pod metrics
kubectl top pods -n jokes-api
```

## Configuration

### Environment Variables

Edit `k8s/configmap.yaml` to change configuration:

```yaml
data:
  NODE_ENV: "production"
  PORT: "5000"
```

Apply changes:

```bash
kubectl apply -f k8s/configmap.yaml
kubectl rollout restart deployment/backend-deployment -n jokes-api
```

### Resource Limits

Edit deployment files to adjust resources:

```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "500m"
```

### Replicas

Change replica count in deployment files or use:

```bash
kubectl scale deployment backend-deployment --replicas=3 -n jokes-api
```
