# DSA-COSE-Voting System

A web-based and mobile-based e-voting system with real-time vote tabulation for TAGOLOAN COMMUNITY COLLEGE.

**Firebase Project**: DSA-COSE-VS (`dsa-cose-vs`)

## Features

- ✅ User Registration and Login (Firebase Authentication)
- ✅ Dashboard with real-time statistics
- ✅ Data Analytics / Reporting
- ✅ Notifications System
- ✅ Real-time vote tabulation
- ✅ Responsive design (Web & Mobile)
- ✅ Admin Panel with User Management
- ✅ Sub-Admin Creation and Management

## Technology Stack

### Frontend
- HTML5
- CSS3 (Maroon & Gold Theme)
- JavaScript (Vanilla JS)
- Firebase JavaScript SDK
- Chart.js (for analytics)

### Backend
- Node.js
- Express.js
- Firebase Firestore (Database)
- Firebase Authentication
- Socket.IO (for real-time updates)
- JWT (for authentication)
- bcryptjs (for password hashing)

## Project Structure

```
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── .dockerignore
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── Procfile
│   ├── README.md
│   ├── cleanup.ps1
│   ├── create-admin.js
│   ├── create-initial-admin.js
│   ├── deploy-to-cloud-run.bat
│   ├── init-firebase.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── start-server.bat
│   ├── start.bat
│   ├── start.ps1
│   ├── test-api-connection.js
│   └── test-firebase-connection.js
├── frontend/
│   ├── admin/
│   ├── analytics/
│   ├── auth/
│   ├── css/
│   ├── dashboard/
│   ├── js/
│   ├── notifications/
│   ├── profile/
│   ├── voting/
│   ├── connection-test.html
│   ├── create-admin.html
│   ├── docker-host-test.html
│   ├── final-hosting-verification.html
│   ├── final-test.html
│   ├── firebase-hosting-test.html
│   ├── full-test.html
│   ├── index.html
│   ├── navigation-test.html
│   ├── setup-test-auth.html
│   ├── simple-create-admin.html
│   ├── simple-fetch-test.html
│   ├── simple-register-test.html
│   ├── test-admin-link.html
│   ├── test-api.html
│   ├── test-connection.html
│   ├── test-firebase.html
│   ├── test-login.html
│   ├── test-middle-initial-fix.html
│   ├── test-middle-initial.html
│   ├── test-register.html
│   └── test.html
├── functions/
├── .dockerignore
├── .firebaserc
├── .gitignore
├── AUTO_HOST_NOW.bat
├── COMMANDS_REFERENCE.md
├── CREATE_ADMIN.bat
├── DATABASE_CONTROLLERS_SETUP.md
├── DEPLOYMENT_GUIDE.md
├── DEPLOY_ALL.bat
├── DEPLOY_BACKEND.bat
├── DEPLOY_DOCKER_TO_FIREBASE.bat
├── DEPLOY_DOCKER_TO_FIREBASE.sh
├── DEPLOY_FRONTEND.bat
├── DEPLOY_FRONTEND_ONLY.bat
├── DEPLOY_TO_CLOUD_RUN.bat
├── DOCKER_DEPLOYMENT_GUIDE.md
├── Dockerfile
├── Dockerfile.frontend
├── HOST_IT_NOW.bat
├── HOST_IT_NOW.sh
├── INIT_FIREBASE.bat
├── PROJECT_STRUCTURE.md
├── QUICK_DOCKER_START.md
├── QUICK_START.md
├── README.md
├── README_DEPLOYMENT.md
├── RUN_NPM.bat
├── Run E-Voting System.bat
├── SETUP.md
├── START_AUTOMATIC.bat
├── START_AUTOMATIC.ps1
├── START_BACKEND.bat
├── START_BACKEND_WITH_FIREBASE.bat
├── START_DEVELOPMENT_SERVERS.bat
├── START_DOCKER_SYSTEM.bat
├── START_FRONTEND.bat
├── START_FULL_SYSTEM.bat
├── START_LOCAL_HOST.bat
├── START_LOCAL_HOST.ps1
├── START_PRODUCTION_BACKEND.bat
├── TERMINAL_COMMANDS.md
├── TOOLS_AND_TECHNOLOGIES.md
├── TROUBLESHOOTING.md
├── create-admin-account.js
├── create-admin-direct.js
├── create-admin.js
├── create-mock-admin.js
├── create-simple-admin.js
├── create-users.js
├── deploy.bat
├── deploy.sh
├── direct-test-auth.js
├── display-user-organization.js
├── docker-compose.yml
├── firebase.json
├── package-lock.json
├── package.json
├── test-firebase-connection.js
├── test-firebase.js
├── test-frontend-backend.js
├── test-local-auth.js
├── test-login-api.js
├── test-login.js
├── update-users.js
└── verify-users.js
```

## Setup Instructions

### Prerequisites
- Node.js v14+
- Firebase Account
- Docker (optional, for containerized deployment)

### Quick Start
1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Configure Firebase:
   - Create a Firebase project
   - Download the service account key
   - Place it in `backend/serviceAccountKey.json`
4. Set up environment variables (see `.env.example`)
5. Start the development servers:
   ```bash
   # Start backend only
   START_BACKEND.bat
   
   # Start both frontend and backend
   START_DEVELOPMENT_SERVERS.bat
   
   # Start frontend with live reloading (recommended for development)
   # For Command Prompt: START_FRONTEND_DEV.bat
   # For PowerShell: START_FRONTEND_DEV.ps1
   ```
   
## Configuration
### Backend Configuration
Create a `.env` file in the `backend` directory with the following variables:
```
PORT=3001
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
JWT_SECRET=your-jwt-secret-key
```

### Frontend Configuration
The frontend automatically detects the environment and sets the appropriate backend URL:
- **Local Development**: `http://localhost:3001/api`
- **Firebase Hosting**: `http://localhost:3001/api` (default, change as needed)

To override the backend URL for production deployments, you can:
1. Set the `backend_url` in localStorage:
   ```javascript
   localStorage.setItem('backend_url', 'http://your-production-backend-url.com');
   ```
2. Or use the configuration page at `/configure-backend.html`

## Deployment

### Firebase Hosting + Docker (Recommended)
1. Deploy frontend to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```
2. Run backend locally or on a server using Docker:
   ```bash
   docker-compose up -d
   ```
3. Configure the backend URL using the configuration page or localStorage

### Docker Deployment
1. Build and start containers:
   ```bash
   docker-compose up -d
   ```
2. Access the application:
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:3001/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Elections
- `GET /api/elections` - List all elections
- `GET /api/elections/:id` - Get election details
- `POST /api/elections` - Create new election (admin only)

### Voting
- `POST /api/vote` - Cast a vote
- `GET /api/vote/results/:electionId` - Get voting results

## Troubleshooting

### Common Issues

1. **Cannot connect to server**
   - Ensure the backend is running (Docker containers or standalone server)
   - Check that the API_BASE_URL in `frontend/js/api-config.js` is correct
   - Verify CORS settings in `backend/server.js`
   - Use the configuration page at `/configure-backend.html` to set the correct backend URL

2. **Firebase connection errors**
   - Verify the service account key is valid
   - Check Firebase project ID in `backend/config/firebase.js`
   - Ensure Firestore is enabled in Firebase Console

3. **Login/Registration failures**
   - Check backend logs for error messages
   - Verify environment variables are set correctly
   - Ensure the database collections exist (run migrations)

### Testing Connections

Test backend health:
```bash
curl http://localhost:3001/api/health
```

Test frontend availability:
```bash
curl http://localhost:8081
```

## License

This project is licensed under the MIT License.