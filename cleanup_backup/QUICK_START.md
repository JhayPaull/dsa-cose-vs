# 🚀 Quick Start - Deploy Your E-Voting System

## One-Click Deployment (Windows)

1. **Double-click** `DEPLOY.bat`
2. Follow the on-screen instructions
3. Your site will be live in 2-5 minutes!

## Your Live URLs

After deployment:
- 🌐 **https://dsa-cose-vs.web.app**
- 🌐 **https://dsa-cose-vs.firebaseapp.com**

## What You Need

- ✅ Google account (for Firebase)
- ✅ Internet connection
- ✅ 5 minutes of time

## First Time Setup

If this is your first time deploying:

1. **Install Firebase CLI** (if prompted):
   ```bash
   npm install -g firebase-tools
   ```

2. **Run the deployment script**:
   - Windows: Double-click `DEPLOY.bat`
   - Mac/Linux: Run `bash DEPLOY.sh`

3. **Sign in** when browser opens

4. **Wait for deployment** (2-5 minutes)

5. **Done!** Your site is live!

## Development Commands

For local development, you can use these commands:

### Quick Start
```batch
# Automatic startup (recommended)
START_AUTOMATIC.bat
```

### Manual Startup
```batch
# Start backend server
START_BACKEND.bat

# Start frontend server
START_FRONTEND.bat
```

### Backend NPM Scripts
```bash
# Navigate to backend directory
cd backend

# Run database migrations
npm run migrate

# Seed initial data
npm run seed

# Test Firebase connection
npm run test-firebase

# Test API connection
npm run test-api
```

## Updating Your Site

To update after making changes:
1. Make your changes
2. Run `DEPLOY.bat` again
3. Changes go live in 1-2 minutes

## Troubleshooting

**"Firebase CLI not found"**
- The script will try to install it automatically
- Or install manually: `npm install -g firebase-tools`

**"Login failed"**
- Make sure you have a Google account
- Try running `firebase login` manually

**"Project not found"**
- Verify you have access to the Firebase project
- Check: https://console.firebase.google.com

## Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions or `COMMANDS_REFERENCE.md` for a complete list of commands.

---

**That's it! Your E-Voting System will be live and accessible worldwide! 🌍**

