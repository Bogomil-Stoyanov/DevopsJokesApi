#!/bin/bash
# Stop Jokes API on Kubernetes

echo "🛑 Stopping Jokes API..."

# Kill any port forwards or tunnels
echo "Closing service tunnels..."
pkill -f "minikube service" || true
pkill -f "kubectl port-forward" || true

# Ask if user wants to delete the deployment or just stop minikube
echo ""
echo "Choose an option:"
echo "  1) Stop Minikube (preserves deployment)"
echo "  2) Delete application (removes all Kubernetes resources)"
echo "  3) Delete application and stop Minikube"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🛑 Stopping Minikube..."
        minikube stop
        echo "✅ Minikube stopped. Run 'minikube start' to restart."
        ;;
    2)
        echo "Deleting application..."
        ./k8s/cleanup.sh
        echo "✅ Application deleted. Minikube is still running."
        ;;
    3)
        echo "Deleting application..."
        ./k8s/cleanup.sh
        echo "🛑 Stopping Minikube..."
        minikube stop
        echo "✅ Application deleted and Minikube stopped."
        ;;
    *)
        echo "❌ Invalid choice. No action taken."
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
