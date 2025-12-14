# 📋 Commands Reference Guide

This document provides a comprehensive reference for all commands available in the TCC E-Voting System, including startup procedures, development commands, testing utilities, and administrative tasks.

## 🚀 Startup Commands

### Automatic Startup (Recommended)
```batch
START_AUTOMATIC.bat
```
- Starts both backend and frontend servers automatically
- Opens browser to frontend
- Runs servers in background

### Manual Startup
```batch
# Start backend server (API on port 3001)
START_BACKEND.bat

# Start frontend server (Web interface on port 8000)
START_FRONTEND.bat
```

### Docker Startup
```batch
# Start system in Docker containers
START_DOCKER_SYSTEM.bat
```

### PowerShell Alternative
```powershell
# Start automatic mode
START_AUTOMATIC.ps1

# Start local host
START_LOCAL_HOST.ps1
```

## ⚙️ Backend NPM Scripts

Navigate to the `backend` directory to use these commands:

```bash
cd backend
```

### Core Commands
```bash
# Start the backend server
npm start

# Start development server with auto-reload
npm run dev

# Initialize Firebase configuration
npm run init-firebase

# Create initial admin user
npm run create-admin
```

### Database Management
```bash
# Run database migrations
npm run migrate

# Seed all initial data
npm run seed

# Seed users only
npm run seed-users

# Seed elections only
npm run seed-elections
```

### Testing Commands
```bash
# Test Firebase connection
npm run test-firebase

# Test API connection
npm run test-api

# Comprehensive frontend-backend connection test
npm run test-connection
```

## 🖥️ Frontend Commands

The frontend uses static file serving, but you can use these commands for development:

### Development Server
```bash
# Serve frontend on port 8000
cd frontend
npx http-server -p 8000
```

### Alternative Serving Options
```bash
# Using Python (if available)
python -m http.server 8000

# Using Node.js serve package
npx serve -l 8000
```

## 🐳 Docker Commands

### Container Management
```bash
# Build and start containers
docker-compose up -d --build

# Start existing containers
docker-compose up -d

# Stop containers
docker-compose down

# View container logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend
```

### Container Status
```bash
# List running containers
docker-compose ps

# Execute commands in backend container
docker-compose exec backend sh

# Execute commands in frontend container
docker-compose exec frontend sh
```

## 🔧 Administrative Commands

### User Management
```batch
# Create admin account
CREATE_ADMIN.bat

# Initialize Firebase
INIT_FIREBASE.bat
```

### Deployment
```batch
# Deploy entire system
DEPLOY_ALL.bat

# Deploy backend only
DEPLOY_BACKEND.bat

# Deploy frontend only
DEPLOY_FRONTEND.bat

# Deploy to Firebase Hosting
DEPLOY_FRONTEND_ONLY.bat

# Deploy Docker to Firebase
DEPLOY_DOCKER_TO_FIREBASE.bat
```

## 🧪 Testing Commands

### API Testing
```bash
# Test Firebase connection
cd backend
npm run test-firebase

# Test API endpoints
npm run test-api

# Comprehensive connection test
npm run test-connection
```

### Manual API Testing
```bash
# Test backend health endpoint
curl http://localhost:3001/api/health

# Test frontend availability
curl http://localhost:8000
```

## 🔌 Network and Ports

### Default Ports
- **Backend API**: `http://localhost:3001`
- **Frontend**: `http://localhost:8000`
- **Docker Frontend**: `http://localhost:8080`

### Port Conflicts Resolution
If ports are already in use:

1. **Find process using port**:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Linux/Mac
   lsof -i :3001
   ```

2. **Kill process**:
   ```bash
   # Windows (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

## 🛠️ Development Utilities

### Package Management
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if needed)
cd frontend
npm install
```

### Environment Setup
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

## 📊 Monitoring and Debugging

### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks
```bash
# Backend health check
curl -f http://localhost:3001/api/health

# Check if frontend is serving
curl -f http://localhost:8000
```

## 🚨 Troubleshooting Commands

### Common Issues

1. **Dependencies not installed**:
   ```bash
   cd backend
   npm install
   
   cd frontend
   npm install
   ```

2. **Firebase connection issues**:
   ```bash
   cd backend
   npm run test-firebase
   ```

3. **Port conflicts**:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

## 📦 Batch File Reference

### Main Batch Files
- `START_AUTOMATIC.bat` - Recommended startup
- `START_BACKEND.bat` - Backend only
- `START_FRONTEND.bat` - Frontend only
- `START_DOCKER_SYSTEM.bat` - Docker deployment
- `CREATE_ADMIN.bat` - Create admin user
- `INIT_FIREBASE.bat` - Initialize Firebase
- `DEPLOY_ALL.bat` - Full deployment

### Utility Batch Files
- `HOST_IT_NOW.bat` - Host system
- `AUTO_HOST_NOW.bat` - Auto-host system
- `RUN_NPM.bat` - Run npm commands
- `START_LOCAL_HOST.bat` - Local hosting

## 🎯 Quick Reference Card

### Daily Development
```bash
# Start development
START_AUTOMATIC.bat

# Or manually
START_BACKEND.bat     # Terminal 1
START_FRONTEND.bat    # Terminal 2
```

### Database Setup
```bash
cd backend
npm run migrate       # Run migrations
npm run seed          # Seed data
```

### Testing
```bash
cd backend
npm run test-firebase    # Test Firebase
npm run test-api         # Test API
npm run test-connection  # Full connection test
```

### Deployment
```bash
# Docker deployment
START_DOCKER_SYSTEM.bat

# Firebase deployment
DEPLOY_FRONTEND_ONLY.bat
```

This reference guide covers all essential commands for developing, testing, and deploying the TCC E-Voting System.