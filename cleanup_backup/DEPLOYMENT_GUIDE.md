# 🚀 Deployment Guide - E-Voting System

## Quick Deploy to Firebase Hosting

Your project is already configured for Firebase Hosting! Follow these steps:

### Prerequisites

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Verify Installation**:
   ```bash
   firebase --version
   ```

### Deployment Steps

#### Option 1: Using the Automated Script (Windows)

1. **Double-click** `HOST_IT_NOW.bat`
2. Follow the prompts
3. Your site will be live at: **https://dsa-cose-vs.web.app**

#### Option 2: Manual Deployment

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Set the Firebase Project**:
   ```bash
   firebase use dsa-cose-vs
   ```

3. **Deploy Frontend**:
   ```bash
   firebase deploy --only hosting
   ```

4. **Deploy Everything** (Frontend + Functions):
   ```bash
   firebase deploy
   ```

### Your Live URLs

After deployment, your site will be available at:
- **Primary**: https://dsa-cose-vs.web.app
- **Alternative**: https://dsa-cose-vs.firebaseapp.com

### Deployment Checklist

Before deploying, ensure:
- ✅ All files are saved
- ✅ Firebase configuration is correct
- ✅ No console errors in browser
- ✅ All images are in the correct folders
- ✅ CSS and JS files are properly linked

### Troubleshooting

**Issue: "Firebase CLI not found"**
- Solution: Install Firebase CLI: `npm install -g firebase-tools`

**Issue: "Permission denied"**
- Solution: Run `firebase login` again

**Issue: "Project not found"**
- Solution: Verify project ID in firebase.json matches your Firebase project

**Issue: "Deployment failed"**
- Check Firebase console: https://console.firebase.google.com
- Verify you have hosting enabled in Firebase project

### Updating Your Site

To update your deployed site:
1. Make your changes
2. Run `firebase deploy --only hosting` again
3. Changes will be live in 1-2 minutes

### Custom Domain (Optional)

To use a custom domain:
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

---

## Alternative Hosting Options

### Netlify (Alternative)

1. Go to https://www.netlify.com
2. Sign up/login
3. Drag and drop the `frontend` folder
4. Your site is live!

### Vercel (Alternative)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the project root
3. Follow the prompts

---

## Backend Deployment

If you need to deploy the backend separately:

### Firebase Cloud Functions
```bash
firebase deploy --only functions
```

### Google Cloud Run (Alternative)
See `backend/deploy-to-cloud-run.bat` for instructions

---

## Support

For issues or questions:
- Firebase Docs: https://firebase.google.com/docs/hosting
- Firebase Console: https://console.firebase.google.com

