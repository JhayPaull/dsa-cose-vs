# Docker Deployment Guide for TCC E-Voting System

This guide explains how to deploy the TCC E-Voting System using Docker containers and Firebase Hosting.

## Prerequisites

1. **Docker Desktop** installed and running
2. **Firebase CLI** installed (`npm install -g firebase-tools`)
3. **Firebase project** set up with Firestore enabled
4. **Service Account Key** downloaded from Firebase Console

## Container Names

- **Backend**: `developmentofwebandmobile-basede-votingsystemwithreal-timevotetabulationforschoolelectionsforcose-backend`
- **Frontend**: `developmentofwebandmobile-basede-votingsystemwithreal-timevotetabulationforschoolelectionsforcose-frontend`

## Ports

- **Backend**: `3001:3001`
- **Frontend**: `8081:8080` (changed from 8080:8080 to avoid conflicts)

## Setup Steps

### 1. Prepare Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `dsa-cose-vs`
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file as `backend/serviceAccountKey.json`
6. Also copy it to the root directory as `dsa-cose-vs-firebase-adminsdk-fbsvc-c1f89c2c57.json` (if you have this file)

### 2. Start Docker Containers

#### Windows:
```batch
START_DOCKER_SYSTEM.bat
```

#### Linux/Mac:
```bash
chmod +x START_DOCKER_SYSTEM.sh
./START_DOCKER_SYSTEM.sh
```

Or manually:
```bash
docker-compose up -d --build
```

### 3. Verify Services

- **Backend Health Check**: http://localhost:3001/api/health
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:3001/api

### 4. Accessing from Other Devices

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

### 4. Check Container Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend
```

### 5. Deploy to Firebase Hosting

#### Option A: Using the deployment script

**Windows:**
```batch
DEPLOY_DOCKER_TO_FIREBASE.bat
```

**Linux/Mac:**
```bash
chmod +x DEPLOY_DOCKER_TO_FIREBASE.sh
./DEPLOY_DOCKER_TO_FIREBASE.sh
```

#### Option B: Manual deployment

1. Make sure you're logged in to Firebase:
   ```bash
   firebase login
   ```

2. Deploy frontend:
   ```bash
   firebase deploy --only hosting
   ```

3. After deployment, configure the backend URL:
   - Open browser console on https://dsa-cose-vs.web.app
   - Run: `localStorage.setItem('backend_url', 'http://your-backend-url:3001')`
   - Or update `frontend/js/api-config.js` with your backend URL

## Firestore Connection

The backend automatically connects to Firestore using:

1. **Service Account Key** (mounted as volume in Docker)
2. **Environment Variables** (if set)
3. **Default Credentials** (for Cloud Run/Firebase hosting)

### Verify Firestore Connection

Check the backend logs:
```bash
docker-compose logs backend | grep -i firebase
```

You should see:
```
✓ Firebase Admin SDK initialized successfully for project: dsa-cose-vs
Firebase Firestore database initialized
```

## Docker Commands

### Start containers
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### View container status
```bash
docker-compose ps
```

### Execute commands in container
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

## Troubleshooting

### Backend won't start

1. **Check service account key**:
   ```bash
   ls -la backend/serviceAccountKey.json
   ```

2. **Check backend logs**:
   ```bash
   docker-compose logs backend
   ```

3. **Verify Firestore is enabled** in Firebase Console

### Frontend can't connect to backend

1. **Check if backend is running**:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check CORS settings** in `backend/server.js`

3. **Update API_BASE_URL** in `frontend/js/api-config.js` or via localStorage

### Firestore connection issues

1. **Verify service account key** is valid and has proper permissions
2. **Check Firebase project ID** matches in `backend/config/firebase.js`
3. **Ensure Firestore is enabled** in Firebase Console
4. **Check network connectivity** from Docker container to Firebase

### Port conflicts

If ports 3001 or 8080 are already in use:

1. **Find process using port**:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Linux/Mac
   lsof -i :3001
   ```

2. **Change ports in docker-compose.yml**:
   ```yaml
   ports:
     - "3002:3001"  # Change host port
   ```

## Production Deployment

For production, you should:

1. **Deploy backend to Cloud Run** or another cloud service
2. **Update API_BASE_URL** in frontend to point to production backend
3. **Use environment variables** for sensitive data
4. **Enable HTTPS** for all services
5. **Set up proper monitoring** and logging

## Environment Variables

You can set environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - FIREBASE_PROJECT_ID=dsa-cose-vs
  - FIREBASE_SERVICE_ACCOUNT_PATH=/usr/src/app/serviceAccountKey.json
```

Or use a `.env` file (not included in git for security).

## Network Configuration

The containers use a Docker bridge network (`evoting-network`) which allows:
- Frontend to communicate with backend using service name: `http://backend:3001`
- Both containers to access external services (Firebase)

## Security Notes

1. **Never commit** `serviceAccountKey.json` to git
2. **Use environment variables** for sensitive data in production
3. **Enable CORS** only for trusted origins
4. **Use HTTPS** in production
5. **Regularly rotate** service account keys

## Support

For issues or questions:
1. Check container logs: `docker-compose logs`
2. Verify Firebase configuration
3. Check network connectivity
4. Review this guide

