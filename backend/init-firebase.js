#!/usr/bin/env node

// Script to initialize Firebase service account key file
const fs = require('fs');
const path = require('path');

// Path to the service account key file
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Check if the file already exists
if (fs.existsSync(serviceAccountPath)) {
    console.log('Service account key file already exists.');
    console.log('If you need to update it, please download a new key from Firebase Console.');
    process.exit(0);
}

// Create a placeholder file with instructions
const placeholderContent = {
    "__comment": "Please replace this file with your actual Firebase service account key",
    "__instructions": [
        "1. Go to Firebase Console (https://console.firebase.google.com)",
        "2. Select your project (DSA-COSE-VS)",
        "3. Go to Project Settings > Service Accounts",
        "4. Click 'Generate new private key'",
        "5. Download the JSON file",
        "6. Rename it to 'serviceAccountKey.json'",
        "7. Replace this file with the downloaded file"
    ],
    "type": "service_account",
    "project_id": "dsa-cose-vs",
    "private_key_id": "YOUR_PRIVATE_KEY_ID",
    "private_key": "-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n",
    "client_email": "firebase-adminsdk-xxxxx@dsa-cose-vs.iam.gserviceaccount.com",
    "client_id": "YOUR_CLIENT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40dsa-cose-vs.iam.gserviceaccount.com"
};

// Write the placeholder file
fs.writeFileSync(serviceAccountPath, JSON.stringify(placeholderContent, null, 2));

console.log('Created placeholder service account key file:');
console.log(serviceAccountPath);
console.log('');
console.log('IMPORTANT: You need to replace this file with your actual Firebase service account key.');
console.log('Follow the instructions in the file to download your key from Firebase Console.');

process.exit(0);