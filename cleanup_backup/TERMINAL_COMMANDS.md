# Complete Terminal Commands Guide

## 📋 Quick Reference - All Commands

### 🚀 Starting the System

#### Option 1: Local Development (Recommended for Testing)

**Start Backend:**
```bash
cd backend
npm install
npm start
```
Backend will run on: `http://localhost:3001`

**Start Frontend (in a new terminal):**
```bash
# If using a simple HTTP server
npx serve frontend -p 8000

# Or using Python (if installed)
cd frontend
python -m http.server 8000

# Or using Node.js http-server
npx http-server frontend -p 8000
```
Frontend will run on: `http://localhost:8000`

#### Option 2: Using Docker

**Start Docker Containers:**
```bash
# Windows
START_DOCKER_SYSTEM.bat

# Linux/Mac
docker-compose up -d --build
```

**View Docker Logs:**
```bash
# All containers
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

**Stop Docker Containers:**
```bash
docker-compose down
```

**Restart Docker Containers:**
```bash
docker-compose restart
```

---

## 🔧 Development Commands

### Backend Commands

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start backend server
npm start

# Start with auto-reload (if nodemon is installed)
npm run dev

# Check if backend is running
curl http://localhost:3001/api/health

# Test backend API
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Frontend Commands

```bash
# Navigate to frontend
cd frontend

# Serve frontend (if using http-server)
npx http-server . -p 8000

# Or using Python
python -m http.server 8000

# Or using serve
npx serve . -p 8000
```

---

## 🐳 Docker Commands

### Basic Docker Commands

```bash
# Build Docker images
docker-compose build

# Start containers in background
docker-compose up -d

# Start containers and see logs
docker-compose up

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# View container status
docker-compose ps

# View logs
docker-compose logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs (live)
docker-compose logs -f

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh

# Rebuild and restart
docker-compose up -d --build

# Remove all containers and images
docker-compose down --rmi all
```

### Docker Container Management

```bash
# List all containers
docker ps -a

# List running containers
docker ps

# Stop a container
docker stop <container-name>

# Start a container
docker start <container-name>

# Remove a container
docker rm <container-name>

# View container logs
docker logs <container-name>

# View container logs (live)
docker logs -f <container-name>

# Access container shell
docker exec -it <container-name> sh
```

---

## 🔥 Firebase Commands

### Firebase Setup

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Check Firebase project
firebase projects:list

# Set Firebase project
firebase use dsa-cose-vs
```

### Firebase Deployment

```bash
# Deploy frontend to Firebase Hosting
firebase deploy --only hosting

# Deploy everything
firebase deploy

# Deploy with message
firebase deploy --only hosting -m "Updated login page"

# View deployment history
firebase hosting:channel:list

# Rollback deployment
firebase hosting:rollback
```

### Firebase Functions (if using)

```bash
# Deploy functions
firebase deploy --only functions

# View function logs
firebase functions:log
```

---

## 🧪 Testing Commands

### Test Backend API

```bash
# Health check
curl http://localhost:3001/api/health

# Test login (replace with actual credentials)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"studentId\":\"12345\",\"year\":\"1\",\"section\":\"A\",\"department\":\"COSE\"}"
```

### Check Ports

```bash
# Windows - Check if port is in use
netstat -ano | findstr :3001
netstat -ano | findstr :8000
netstat -ano | findstr :8080

# Linux/Mac - Check if port is in use
lsof -i :3001
lsof -i :8000
lsof -i :8080

# Kill process on port (Windows)
# Find PID from netstat, then:
taskkill /PID <pid> /F

# Kill process on port (Linux/Mac)
kill -9 $(lsof -t -i:3001)
```

---

## 📦 Package Management

### NPM Commands

```bash
# Install dependencies
npm install

# Install specific package
npm install <package-name>

# Install dev dependency
npm install --save-dev <package-name>

# Update packages
npm update

# Check for outdated packages
npm outdated

# Remove package
npm uninstall <package-name>

# Clear npm cache
npm cache clean --force
```

### Node.js Version

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check all installed packages
npm list

# Check global packages
npm list -g --depth=0
```

---

## 🔍 Debugging Commands

### Check System Status

```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Check if Docker is running
docker --version
docker ps

# Check if Firebase CLI is installed
firebase --version

# Check network connectivity
ping localhost
```

### View Logs

```bash
# Backend logs (if running with npm start)
# Logs appear in the terminal where you ran npm start

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# System logs (Linux/Mac)
tail -f /var/log/syslog

# Windows Event Viewer
eventvwr
```

---

## 🗄️ Database Commands

### Firestore (via Firebase Console)

```bash
# No direct CLI commands for Firestore queries
# Use Firebase Console: https://console.firebase.google.com
# Or use Firebase Admin SDK in backend code
```

### Test Firestore Connection

```bash
# Check backend logs for Firebase initialization
# Should see: "✓ Firebase Admin SDK initialized successfully"
```

---

## 🚀 Deployment Commands

### Deploy to Firebase Hosting

```bash
# Full deployment
firebase deploy --only hosting

# Using batch file (Windows)
DEPLOY_DOCKER_TO_FIREBASE.bat

# Using shell script (Linux/Mac)
chmod +x DEPLOY_DOCKER_TO_FIREBASE.sh
./DEPLOY_DOCKER_TO_FIREBASE.sh
```

### Deploy Backend to Cloud Run (if needed)

```bash
# Using batch file (Windows)
DEPLOY_TO_CLOUD_RUN.bat

# Manual deployment
gcloud run deploy tcc-e-voting-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 🧹 Cleanup Commands

### Clean Node Modules

```bash
# Remove node_modules
rm -rf node_modules  # Linux/Mac
rmdir /s node_modules  # Windows

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Clean Docker

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a

# Remove specific container
docker rm <container-name>

# Remove specific image
docker rmi <image-name>
```

### Clean Build Files

```bash
# Remove build artifacts
rm -rf dist build .next  # Linux/Mac
rmdir /s dist build .next  # Windows
```

---

## 📝 Common Workflows

### Complete Setup (First Time)

```bash
# 1. Install dependencies
cd backend
npm install
cd ../frontend
# (No npm install needed for frontend - it's static)

# 2. Start backend
cd ../backend
npm start

# 3. In new terminal, start frontend
cd frontend
npx serve . -p 8000

# 4. Open browser
# http://localhost:8000
```

### Daily Development

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npx serve . -p 8000

# Terminal 3: Docker (if using)
docker-compose up -d
```

### Testing Before Deployment

```bash
# 1. Test backend
curl http://localhost:3001/api/health

# 2. Test frontend
# Open http://localhost:8000 in browser

# 3. Test login/register
# Use browser to test forms

# 4. Check console for errors
# F12 in browser → Console tab
```

### Deploy to Production

```bash
# 1. Build and test locally
npm start  # Backend
npx serve frontend -p 8000  # Frontend

# 2. Deploy frontend to Firebase
firebase deploy --only hosting

# 3. Deploy backend (if using Cloud Run)
gcloud run deploy tcc-e-voting-backend --source .
```

---

## 🆘 Emergency Commands

### Stop Everything

```bash
# Stop all Node processes
pkill node  # Linux/Mac
taskkill /F /IM node.exe  # Windows

# Stop Docker
docker-compose down

# Stop specific port
# Windows: Find PID with netstat, then taskkill
# Linux/Mac: kill -9 $(lsof -t -i:3001)
```

### Reset Everything

```bash
# Stop Docker
docker-compose down -v

# Remove node_modules
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Restart Docker
docker-compose up -d --build
```

---

## 📚 Additional Resources

### Check Documentation

```bash
# NPM package info
npm info <package-name>

# Firebase CLI help
firebase help

# Docker help
docker --help
docker-compose --help
```

### Environment Variables

```bash
# Windows - Set environment variable
set NODE_ENV=production

# Linux/Mac - Set environment variable
export NODE_ENV=production

# Use .env file (recommended)
# Create .env file in backend folder
```

---

## 💡 Pro Tips

1. **Use multiple terminals** - One for backend, one for frontend, one for Docker
2. **Check logs regularly** - Use `-f` flag to follow logs in real-time
3. **Test API with curl** - Before testing in browser, test API directly
4. **Use browser DevTools** - F12 → Console and Network tabs are your friends
5. **Keep Docker clean** - Regularly run `docker system prune` to free space

---

## 🎯 Quick Command Reference

| Task | Command |
|------|---------|
| Start Backend | `cd backend && npm start` |
| Start Frontend | `cd frontend && npx serve . -p 8000` |
| Start Docker | `docker-compose up -d` |
| Stop Docker | `docker-compose down` |
| View Logs | `docker-compose logs -f` |
| Deploy Firebase | `firebase deploy --only hosting` |
| Test API | `curl http://localhost:3001/api/health` |
| Check Ports | `netstat -ano \| findstr :3001` (Windows) or `lsof -i :3001` (Linux/Mac) |

---

**Note**: Replace `<container-name>`, `<package-name>`, etc. with actual values. Commands may vary slightly between Windows, Linux, and Mac.

