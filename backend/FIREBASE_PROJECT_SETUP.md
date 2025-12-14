# Firebase Project Setup for DSA-COSE-Voting System

This document provides specific setup instructions for connecting to your Firebase project: **DSA-COSE-Voting System**

## Project Information

- **Project ID**: `dsa-cose-voting-system`
- **Project Name**: DSA-COSE-Voting System
- **Auth Domain**: `dsa-cose-voting-system.firebaseapp.com`

## Step 1: Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **DSA-COSE-Voting System**
3. Click the **gear icon** ⚙️ next to "Project Overview"
4. Select **"Project settings"**
5. Go to the **"Service accounts"** tab
6. Click **"Generate new private key"**
7. Click **"Generate key"** in the confirmation dialog
8. Save the downloaded JSON file as `serviceAccountKey.json` in the `backend` folder

## Step 2: Configure Backend

1. Copy `serviceAccountKey.json` to the `backend` folder
2. Update your `.env` file in the `backend` folder:

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Server Configuration
PORT=3000

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

3. Make sure `serviceAccountKey.json` is in `.gitignore`:

```gitignore
serviceAccountKey.json
*.json
!package.json
```

## Step 3: Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. If not already enabled, click **"Create database"**
3. Select **"Start in production mode"** (we'll set up security rules)
4. Choose a location (e.g., `asia-southeast1` for Philippines)
5. Click **"Enable"**

## Step 4: Set Up Firestore Security Rules

1. Go to **"Firestore Database"** → **"Rules"** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Elections collection
    match /elections/{electionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Candidates collection
    match /candidates/{candidateId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Votes collection - only backend can write
    match /votes/{voteId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Vote history collection - only backend can write
    match /vote_history/{historyId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Create Firestore Indexes

Go to **"Firestore Database"** → **"Indexes"** tab and create:

1. **Collection**: `elections`
   - Fields: `status` (Ascending), `end_date` (Descending)

2. **Collection**: `candidates`
   - Fields: `election_id` (Ascending), `position` (Ascending)

3. **Collection**: `votes`
   - Fields: `user_id` (Ascending), `election_id` (Ascending)

4. **Collection**: `notifications`
   - Fields: `user_id` (Ascending), `read` (Ascending), `created_at` (Descending)

## Step 6: Install Dependencies

```bash
cd backend
npm install
```

## Step 7: Test Connection

1. Start the backend server:

```bash
npm start
```

2. You should see:
```
Firebase Admin SDK initialized successfully for project: dsa-cose-voting-system
Server running on port 3000
```

3. Test the API:

```bash
curl http://localhost:3000/api/health
```

## Frontend Configuration

The frontend is already configured with your Firebase project credentials in:
- `frontend/js/firebase-config.js` (ES6 modules version)
- `frontend/index.html` (CDN version)

The frontend will automatically connect to your Firebase project when loaded.

## Verification

To verify everything is working:

1. **Backend**: Check server logs for Firebase initialization message
2. **Frontend**: Open browser console, you should see "Firebase initialized for DSA-COSE-Voting System"
3. **Firestore**: Check Firebase Console → Firestore Database to see collections being created

## Troubleshooting

### Error: "Permission denied"
- Check Firestore security rules
- Verify service account has proper permissions

### Error: "Service account key not found"
- Verify `serviceAccountKey.json` is in the `backend` folder
- Check the path in `.env` file

### Error: "Project not found"
- Verify project ID is correct: `dsa-cose-voting-system`
- Check service account has access to the project

## Next Steps

1. Register your first user through the frontend
2. Check Firestore Console to see the `users` collection created
3. Create test elections and candidates
4. Test voting functionality

Your Firebase project is now connected and ready to use!

