const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Firebase Project Configuration
const FIREBASE_PROJECT_ID = 'dsa-cose-vs';

// Initialize Firebase Admin SDK
let firebaseApp;

try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
        let serviceAccount = null;
        
        // Option 1: Use service account key from environment variable (recommended for production)
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            try {
                serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
                console.log('Using Firebase service account from FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
            } catch (parseError) {
                console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
            }
        }
        // Option 2: Use service account file path from environment variable
        else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
            if (fs.existsSync(serviceAccountPath)) {
                try {
                    serviceAccount = require(serviceAccountPath);
                    console.log(`Using Firebase service account from: ${serviceAccountPath}`);
                } catch (requireError) {
                    console.error(`Error loading service account from ${serviceAccountPath}:`, requireError.message);
                }
            } else {
                console.error(`Service account file not found at: ${serviceAccountPath}`);
            }
        }
        // Option 3: Try to auto-load serviceAccountKey.json from backend folder (default)
        else {
            const defaultServiceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
            if (fs.existsSync(defaultServiceAccountPath)) {
                try {
                    const fileContent = fs.readFileSync(defaultServiceAccountPath, 'utf8');
                    // Check if file is not just the placeholder
                    if (fileContent && !fileContent.includes('__comment') && fileContent.trim() !== '{}') {
                        serviceAccount = JSON.parse(fileContent);
                        console.log(`Using Firebase service account from: ${defaultServiceAccountPath}`);
                    } else {
                        console.warn('serviceAccountKey.json exists but appears to be a placeholder. Please download your service account key from Firebase Console.');
                    }
                } catch (parseError) {
                    console.error(`Error parsing service account key from ${defaultServiceAccountPath}:`, parseError.message);
                }
            } else {
                console.warn(`Service account key file not found at: ${defaultServiceAccountPath}`);
                console.warn('Please download your service account key from Firebase Console and save it as serviceAccountKey.json in the backend folder.');
            }
        }

        // Initialize Firebase with the service account if available
        if (serviceAccount) {
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: FIREBASE_PROJECT_ID
            });
        }
        // Option 4: Use default credentials (for Firebase hosting/Cloud Functions)
        else {
            console.log('Attempting to use Firebase default credentials...');
            firebaseApp = admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: FIREBASE_PROJECT_ID
            });
        }
    } else {
        firebaseApp = admin.app();
    }

    console.log(`✓ Firebase Admin SDK initialized successfully for project: ${FIREBASE_PROJECT_ID}`);
} catch (error) {
    console.error('✗ Error initializing Firebase Admin SDK:', error.message);
    console.error('Please ensure you have:');
    console.error('1. Downloaded the service account key from Firebase Console');
    console.error('2. Saved it as serviceAccountKey.json in the backend folder');
    console.error('3. Or set FIREBASE_SERVICE_ACCOUNT_PATH environment variable');
    throw error;
}

// Get Firestore database instance
const db = admin.firestore();

// Export for use in other files
module.exports = { admin, db, firebaseApp };