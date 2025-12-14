#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     E-Voting System - Firebase Hosting Deployment      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "This will deploy your frontend to Firebase Hosting"
echo "Your site will be live at: https://dsa-cose-vs.web.app"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "[1/4] Checking Firebase CLI installation..."
if ! command -v firebase &> /dev/null; then
    echo ""
    echo "❌ Firebase CLI not found!"
    echo ""
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Failed to install Firebase CLI"
        echo "Please install manually: npm install -g firebase-tools"
        exit 1
    fi
    echo "✅ Firebase CLI installed successfully"
else
    echo "✅ Firebase CLI is installed"
fi

echo ""
echo "[2/4] Logging in to Firebase..."
echo "(A browser window will open - please sign in with your Google account)"
echo ""
firebase login --no-localhost
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Login failed. Please try again."
    exit 1
fi
echo "✅ Logged in successfully"

echo ""
echo "[3/4] Setting Firebase project to: dsa-cose-vs"
firebase use dsa-cose-vs
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Project not found or not set. Continuing anyway..."
fi

echo ""
echo "[4/4] Deploying frontend to Firebase Hosting..."
echo "This may take 2-5 minutes..."
echo ""
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                    🎉 SUCCESS! 🎉                         ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "Your E-Voting System is now LIVE!"
    echo ""
    echo "🌐 Primary URL:   https://dsa-cose-vs.web.app"
    echo "🌐 Alternative:  https://dsa-cose-vs.firebaseapp.com"
    echo ""
    echo "You can now share these URLs with users!"
    echo ""
    echo "To update your site, simply run this script again."
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Common issues:"
    echo "- Make sure you're logged in: firebase login"
    echo "- Check Firebase Console: https://console.firebase.google.com"
    echo "- Verify project ID matches: dsa-cose-vs"
    echo ""
fi
