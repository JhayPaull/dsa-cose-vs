#!/bin/bash

echo "========================================"
echo "  DEPLOYING YOUR SITE TO FIREBASE"
echo "========================================"
echo ""
echo "This will make your site accessible at:"
echo "https://dsa-cose-vs.web.app"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Step 1: Logging in to Firebase..."
echo "(A browser window will open - please sign in)"
echo ""
firebase login

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Login failed. Please try again."
    exit 1
fi

echo ""
echo "Step 2: Setting Firebase project..."
firebase use dsa-cose-vs

echo ""
echo "Step 3: Deploying your site..."
echo "This may take a few minutes..."
echo ""
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  SUCCESS! YOUR SITE IS NOW LIVE!"
    echo "========================================"
    echo ""
    echo "Your site is available at:"
    echo "https://dsa-cose-vs.web.app"
    echo ""
    echo "You can now search for it and access it online!"
    echo ""
else
    echo ""
    echo "ERROR: Deployment failed. Please check the error above."
    echo ""
fi

