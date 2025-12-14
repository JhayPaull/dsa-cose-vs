#!/bin/bash

echo "========================================"
echo "Deploying Docker Containers and Firebase Hosting"
echo "========================================"
echo ""

echo "Step 1: Building Docker containers..."
echo ""
docker-compose build
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build Docker containers."
    exit 1
fi

echo ""
echo "Step 2: Starting Docker containers..."
echo ""
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start Docker containers."
    exit 1
fi

echo ""
echo "Step 3: Waiting for backend to be healthy..."
echo ""
sleep 10

echo ""
echo "Step 4: Checking backend health..."
echo ""
curl -f http://localhost:3001/api/health
if [ $? -ne 0 ]; then
    echo "WARNING: Backend health check failed, but continuing..."
else
    echo "Backend is healthy!"
fi

echo ""
echo "Step 5: Deploying frontend to Firebase Hosting..."
echo ""
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to deploy to Firebase Hosting."
    echo "Make sure you're logged in: firebase login"
    exit 1
fi

echo ""
echo "========================================"
echo "DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "Docker Containers:"
echo "- Backend: http://localhost:3001"
echo "- Frontend: http://localhost:8080"
echo ""
echo "Firebase Hosting:"
echo "- Frontend: https://dsa-cose-vs.web.app"
echo ""
echo "IMPORTANT: Update the API_BASE_URL in frontend/js/api-config.js"
echo "to point to your backend URL for production, or set it via:"
echo "localStorage.setItem('backend_url', 'https://your-backend-url.com');"
echo ""

