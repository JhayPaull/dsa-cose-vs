# Quick Start - Docker & Firebase Deployment

## 🚀 Quick Start Commands

### Start Docker System
**Windows:**
```batch
START_DOCKER_SYSTEM.bat
```

**Linux/Mac:**
```bash
docker-compose up -d --build
```

### Deploy to Firebase
**Windows:**
```batch
DEPLOY_DOCKER_TO_FIREBASE.bat
```

**Linux/Mac:**
```bash
firebase deploy --only hosting
```

## 📋 Container Information

- **Backend Container**: `developmentofwebandmobile-basede-votingsystemwithreal-timevotetabulationforschoolelectionsforcose-backend`
- **Frontend Container**: `developmentofwebandmobile-basede-votingsystemwithreal-timevotetabulationforschoolelectionsforcose-frontend`
- **Backend Port**: `3001:3001`
- **Frontend Port**: `8081:8080` (changed from 8080:8080 to avoid conflicts)

## ✅ Verify Everything Works

1. **Backend Health**: http://localhost:3001/api/health
2. **Frontend**: http://localhost:8081
3. **Firebase Hosting**: https://dsa-cose-vs.web.app

## 📱 Accessing from Other Devices

To access the system from other devices on the same network:

1. Find your computer's IP address:
   - Windows: Open Command Prompt and run `ipconfig`, look for "IPv4 Address"
   - macOS/Linux: Open Terminal and run `ifconfig` or `ip addr`

2. Access the system using your computer's IP address:
   - Frontend: http://YOUR_COMPUTER_IP:8081
   - Backend API: http://YOUR_COMPUTER_IP:3001/api
   - Backend Health Check: http://YOUR_COMPUTER_IP:3001/api/health

Example: If your computer's IP is 192.168.1.100:
- Frontend: http://192.168.1.100:8081
- Backend API: http://192.168.1.100:3001/api
- Backend Health Check: http://192.168.1.100:3001/api/health

## 🔧 Firestore Connection

The backend automatically connects to Firestore using the service account key mounted in Docker. Verify connection:

```bash
docker-compose logs backend | grep Firebase
```

Should show: `✓ Firebase Admin SDK initialized successfully`

## 📝 Important Notes

1. **Service Account Key** must be in `backend/serviceAccountKey.json`
2. **Backend URL** for production must be configured in `frontend/js/api-config.js` or via localStorage
3. **CORS** is configured to allow requests from Firebase Hosting domains

## 🐛 Troubleshooting

- **Backend not starting?** Check logs: `docker-compose logs backend`
- **Frontend can't connect?** Verify backend is running and CORS is configured
- **Firestore issues?** Verify service account key has proper permissions

For detailed information, see `DOCKER_DEPLOYMENT_GUIDE.md`

