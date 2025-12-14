const { db, admin } = require('./firebase');

// Collection names
const COLLECTIONS = {
    USERS: 'users',
    ELECTIONS: 'elections',
    CANDIDATES: 'candidates',
    VOTES: 'votes',
    NOTIFICATIONS: 'notifications',
    VOTE_HISTORY: 'vote_history'
};

// Initialize collections with indexes (Firestore automatically creates collections)
async function initializeDatabase() {
    try {
        console.log('Firebase Firestore database initialized');
        console.log('Collections will be created automatically on first write');
        
        // Note: Firestore creates collections automatically when you first write to them
        // You can optionally create indexes in Firebase Console for better query performance
        
        // Load models for schema validation
        const User = require('../models/User');
        const Election = require('../models/Election');
        const Candidate = require('../models/Candidate');
        const Vote = require('../models/Vote');
        const Notification = require('../models/Notification');
        
        console.log('Database models loaded successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Helper function to convert Firestore timestamp to JavaScript Date
function convertTimestamp(timestamp) {
    if (timestamp && timestamp.toDate) {
        return timestamp.toDate();
    }
    return timestamp;
}

// Helper function to convert Date to Firestore timestamp
function toFirestoreTimestamp(date) {
    if (date instanceof Date) {
        return admin.firestore.Timestamp.fromDate(date);
    }
    return admin.firestore.FieldValue.serverTimestamp();
}

module.exports = {
    db,
    admin,
    COLLECTIONS,
    initializeDatabase,
    convertTimestamp,
    toFirestoreTimestamp
};