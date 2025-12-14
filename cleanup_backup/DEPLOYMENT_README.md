# E-Voting System - Firebase and Docker Deployment

This document explains how to deploy and run the E-Voting System using Firebase for the frontend and Docker for both frontend and backend services.

## Prerequisites

1. Docker Desktop installed and running
2. Node.js v14+ installed
3. Firebase account and CLI installed
4. Firebase project created with ID: `dsa-cose-vs`
5. Firebase service account key file (`serviceAccountKey.json`) placed in the `backend` directory

## Running Locally with Docker

### 1. Start the Services

```bash
# Navigate to the project root directory
cd "Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE"

# Build and start the containers
docker-compose up -d --build
```

### 2. Access the Application

- Frontend: http://localhost:8081
- Backend API: http://localhost:3001/api

### 3. Stop the Services

```bash
# Stop and remove containers
docker-compose down
```

## Deploying to Firebase Hosting

### 1. Run the Deployment Script

Double-click on `DEPLOY_FRONTEND_TO_FIREBASE.bat` or run:

```bash
./DEPLOY_FRONTEND_TO_FIREBASE.bat
```

### 2. Configure Backend URL

After deployment, visit your Firebase site and use the "Configure Backend" link to set your backend URL:

- Primary URL: https://dsa-cose-vs.web.app
- Alternative: https://dsa-cose-vs.firebaseapp.com

## Backend Deployment Options

Since you requested not to use Google Cloud, you have these options for deploying the backend:

### Option 1: Run Locally (Recommended for Testing)

Keep the Docker containers running locally. Users on the same network can access the system using your machine's IP address.

### Option 2: Deploy to a VPS or Dedicated Server

1. Copy the entire project to your server
2. Install Docker and Docker Compose
3. Place your Firebase service account key in the `backend` directory
4. Run `docker-compose up -d`

### Option 3: Use a Third-Party Hosting Service

Deploy the backend container to services like:
- DigitalOcean App Platform
- Heroku Container Registry
- AWS ECS
- Azure Container Instances

## Configuration

### Environment Variables

The Docker containers use these environment variables:

**Backend:**
- `NODE_ENV`: production
- `PORT`: 3001
- `FIREBASE_PROJECT_ID`: dsa-cose-vs
- `FIREBASE_SERVICE_ACCOUNT_PATH`: /usr/src/app/serviceAccountKey.json
- `JWT_SECRET`: tcc_evoting_secret_key_2024

**Frontend:**
- `NODE_ENV`: production
- `BACKEND_URL`: http://backend:3001
- `API_BASE_URL`: http://backend:3001/api

### Firebase Configuration

The Firebase configuration is already set up in:
- `firebase.json`: Hosting and functions configuration
- `.firebaserc`: Project ID mapping

## Testing the Deployment

### 1. Check Backend Health

Visit: http://localhost:3001/api/health

Should return:
```json
{
  "status": "OK",
  "message": "TCC E-Voting API is running",
  "database": "Firebase",
  "timestamp": "2025-12-10T03:25:07.091Z"
}
```

### 2. Test Frontend Access

Visit: http://localhost:8081

You should see the landing page with options to login or register.

### 3. Test API Connection

Use the "Configure Backend" page to test the connection to your backend.

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - If port 8081 or 3001 is already in use, modify `docker-compose.yml` to use different ports

2. **Firebase Service Account Issues**
   - Ensure `serviceAccountKey.json` exists in the `backend` directory
   - Verify the key has the necessary permissions

3. **Docker Build Failures**
   - Check internet connectivity
   - Ensure Docker has sufficient resources allocated

4. **Connection Issues**
   - Check that both containers are running: `docker-compose ps`
   - Verify the backend health endpoint: `curl http://localhost:3001/api/health`

### Logs and Debugging

View container logs:
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# View live logs
docker-compose logs -f
```

## Next Steps

1. Create an admin account using the "Create Admin" functionality
2. Configure elections and candidates through the admin panel
3. Share the frontend URL with users for voting
4. Monitor votes in real-time through the analytics dashboard

## Support

For issues or questions:
1. Check container logs: `docker-compose logs`
2. Verify Firebase configuration
3. Ensure network connectivity between frontend and backend