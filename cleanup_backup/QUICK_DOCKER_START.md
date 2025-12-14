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
- **Frontend Port**: `8080:8080`

## ✅ Verify Everything Works

1. **Backend Health**: http://localhost:3001/api/health
2. **Frontend**: http://localhost:8080
3. **Firebase Hosting**: https://dsa-cose-vs.web.app

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

