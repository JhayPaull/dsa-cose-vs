# Firebase Setup Guide for DSA-COSE-Voting System

This guide will help you set up Firebase as the database for the DSA-COSE-Voting System.

**Project ID**: `dsa-cose-voting-system`

## What is Firebase?

Firebase is Google's Backend-as-a-Service (BaaS) platform that provides:
- **Firestore Database**: NoSQL document database for storing data
- **Real-time Database**: Real-time synchronized database
- **Authentication**: User authentication service
- **Cloud Functions**: Serverless functions
- **Hosting**: Web hosting
- **Storage**: File storage
- **Analytics**: App analytics

## Why Use Firebase?

1. **No Server Management**: No need to manage database servers
2. **Real-time Updates**: Automatic synchronization across clients
3. **Scalability**: Automatically scales with your application
4. **Security**: Built-in security rules
5. **Free Tier**: Generous free tier for development
6. **Easy Integration**: Simple SDK integration

## Step 1: Access Your Firebase Project

Your Firebase project is already created: **DSA-COSE-Voting System**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **DSA-COSE-Voting System** (Project ID: `dsa-cose-voting-system`)

## Step 2: Enable Firestore Database

1. In the Firebase Console, click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll set up security rules later)
4. Choose a location closest to your users (e.g., `us-central1`, `asia-southeast1`)
5. Click **"Enable"**

## Step 3: Create a Service Account

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Go to the **"Service accounts"** tab
4. Click **"Generate new private key"**
5. Click **"Generate key"** in the confirmation dialog
6. A JSON file will be downloaded - **SAVE THIS FILE SECURELY**
7. This file contains your service account credentials

## Step 4: Configure Backend

### Option A: Using Service Account File (Recommended for Development)

1. Copy the downloaded JSON file to your `backend` folder
2. Rename it to `serviceAccountKey.json` (or any name you prefer)
3. Add it to `.gitignore` to prevent committing it to version control:

```gitignore
serviceAccountKey.json
*.json
!package.json
```

4. Update your `.env` file:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

### Option B: Using Environment Variable (Recommended for Production)

1. Open the downloaded JSON file
2. Copy the entire JSON content
3. In your `.env` file, add it as a single-line string:

```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

**Note**: Make sure to escape quotes properly if using this method.

## Step 5: Install Dependencies

Navigate to the backend folder and install Firebase Admin SDK:

```bash
cd backend
npm install
```

This will install `firebase-admin` along with other dependencies.

## Step 6: Set Up Firestore Security Rules

1. In Firebase Console, go to **"Firestore Database"**
2. Click on the **"Rules"** tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - read/write for authenticated users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Elections collection - read for all, write for admins
    match /elections/{electionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Candidates collection - read for all, write for admins
    match /candidates/{candidateId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Votes collection - read for all, write only through backend
    match /votes/{voteId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write votes
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Vote history collection - read for all, write only through backend
    match /vote_history/{historyId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write
    }
  }
}
```

4. Click **"Publish"**

## Step 7: Create Firestore Indexes (Optional but Recommended)

Firestore requires composite indexes for certain queries. When you run queries that need indexes, Firebase will provide links to create them automatically. However, you can create them manually:

1. Go to **"Firestore Database"** → **"Indexes"** tab
2. Click **"Create Index"**
3. Create indexes for:
   - Collection: `elections`, Fields: `status` (Ascending), `end_date` (Descending)
   - Collection: `candidates`, Fields: `election_id` (Ascending), `position` (Ascending)
   - Collection: `votes`, Fields: `user_id` (Ascending), `election_id` (Ascending)
   - Collection: `notifications`, Fields: `user_id` (Ascending), `read` (Ascending), `created_at` (Descending)

## Step 8: Test the Connection

1. Start your backend server:

```bash
cd backend
npm start
```

2. You should see: `Firebase Admin SDK initialized successfully`
3. Test the API:

```bash
curl http://localhost:3000/api/health
```

## Firebase Collections Structure

Your Firestore database will have the following collections:

### 1. `users`
```javascript
{
  id: "auto-generated-id",
  full_name: "John Doe",
  student_id: "2024-001",
  email: "john@example.com",
  password: "hashed_password",
  role: "voter", // or "admin"
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### 2. `elections`
```javascript
{
  id: "auto-generated-id",
  title: "Student Council Election 2024",
  description: "Annual election",
  start_date: Timestamp,
  end_date: Timestamp,
  status: "active", // "upcoming", "active", "ended"
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### 3. `candidates`
```javascript
{
  id: "auto-generated-id",
  election_id: "election-id",
  name: "Jane Smith",
  position: "President",
  party: "Independent",
  bio: "Candidate bio",
  photo_url: "https://...",
  votes: 0,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### 4. `votes`
```javascript
{
  id: "auto-generated-id",
  user_id: "user-id",
  election_id: "election-id",
  candidate_id: "candidate-id",
  created_at: Timestamp
}
```

### 5. `notifications`
```javascript
{
  id: "auto-generated-id",
  user_id: "user-id" or null,
  title: "Notification Title",
  message: "Notification message",
  type: "info", // "info", "success", "warning", "error", "vote", "election"
  read: false,
  created_at: Timestamp
}
```

### 6. `vote_history`
```javascript
{
  id: "auto-generated-id",
  election_id: "election-id",
  candidate_id: "candidate-id",
  timestamp: Timestamp
}
```

## Firebase Features Used in This Project

### 1. Firestore Database
- **Document-based storage**: Data stored as documents in collections
- **Real-time listeners**: Can listen to data changes in real-time
- **Queries**: Powerful querying capabilities
- **Transactions**: Atomic operations for data consistency

### 2. Real-time Updates
- Socket.IO integration for real-time vote updates
- Can be enhanced with Firestore real-time listeners

### 3. Security Rules
- Server-side security rules
- Client-side validation
- Authentication-based access control

## Other Firebase Services You Can Use

### 1. Firebase Authentication
Instead of custom JWT authentication, you can use:
- Email/Password authentication
- Google Sign-In
- Facebook Login
- Phone authentication

### 2. Firebase Cloud Functions
For serverless backend logic:
- Automatic vote counting
- Scheduled tasks
- Email notifications
- Data processing

### 3. Firebase Storage
For file uploads:
- Candidate photos
- Election documents
- Reports

### 4. Firebase Hosting
For deploying your frontend:
- Fast CDN delivery
- SSL certificates
- Custom domains

### 5. Firebase Cloud Messaging (FCM)
For push notifications:
- Real-time notifications
- Cross-platform support
- Targeted messaging

## Best Practices

1. **Security**: Always use security rules, never expose service account keys
2. **Indexes**: Create indexes for frequently queried fields
3. **Data Structure**: Design your data structure to minimize reads
4. **Batching**: Use batch writes for multiple operations
5. **Error Handling**: Always handle Firestore errors gracefully
6. **Cost Optimization**: Monitor your usage, especially reads/writes

## Troubleshooting

### Error: "Permission denied"
- Check your Firestore security rules
- Verify service account has proper permissions

### Error: "Index required"
- Create the required composite index
- Firebase will provide a link in the error message

### Error: "Service account key not found"
- Verify the path in `.env` file
- Check file permissions
- Ensure JSON file is valid

### Connection Issues
- Verify internet connection
- Check Firebase project is active
- Verify service account credentials

## Cost Considerations

Firebase Firestore Free Tier (Spark Plan):
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB storage

For production, consider the Blaze Plan (pay-as-you-go):
- $0.06 per 100,000 document reads
- $0.18 per 100,000 document writes
- $0.02 per GB storage

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## Support

For issues or questions:
1. Check Firebase Console for error logs
2. Review Firestore security rules
3. Verify service account permissions
4. Check backend logs for detailed error messages

