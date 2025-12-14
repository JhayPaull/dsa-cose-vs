#!/bin/bash

echo "========================================"
echo "DSA-COSE-Voting System Deployment"
echo "========================================"
echo ""

echo "Step 1: Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

firebase --version

echo ""
echo "Step 2: Login to Firebase..."
echo "This will open your browser for authentication."
firebase login

echo ""
echo "Step 3: Initializing Firebase..."
echo "(Configuration files already exist, this will verify setup)"
firebase use dsa-cose-voting-system

echo ""
echo "Step 4: Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo "Your site should be available at:"
echo "https://dsa-cose-voting-system.web.app"
echo "or"
echo "https://dsa-cose-voting-system.firebaseapp.com"
echo ""

