// Migration script to create initial collections and indexes
// This script ensures that all required collections exist in Firestore

const { db, COLLECTIONS } = require('../config/database-firebase');

async function up() {
    console.log('Running migration 001: Create collections');
    
    try {
        // In Firestore, collections are created automatically when documents are added
        // However, we can create dummy documents to ensure collections exist
        
        // Create a dummy document in each collection to ensure they exist
        const timestamp = new Date();
        
        // Users collection
        await db.collection(COLLECTIONS.USERS).doc('_migration_placeholder').set({
            createdAt: timestamp,
            note: 'Placeholder document to ensure collection exists'
        });
        console.log('Created placeholder in users collection');
        
        // Elections collection
        await db.collection(COLLECTIONS.ELECTIONS).doc('_migration_placeholder').set({
            createdAt: timestamp,
            note: 'Placeholder document to ensure collection exists'
        });
        console.log('Created placeholder in elections collection');
        
        // Candidates collection
        await db.collection(COLLECTIONS.CANDIDATES).doc('_migration_placeholder').set({
            createdAt: timestamp,
            note: 'Placeholder document to ensure collection exists'
        });
        console.log('Created placeholder in candidates collection');
        
        // Votes collection
        await db.collection(COLLECTIONS.VOTES).doc('_migration_placeholder').set({
            createdAt: timestamp,
            note: 'Placeholder document to ensure collection exists'
        });
        console.log('Created placeholder in votes collection');
        
        // Notifications collection
        await db.collection(COLLECTIONS.NOTIFICATIONS).doc('_migration_placeholder').set({
            createdAt: timestamp,
            note: 'Placeholder document to ensure collection exists'
        });
        console.log('Created placeholder in notifications collection');
        
        // Vote history collection
        await db.collection(COLLECTIONS.VOTE_HISTORY).doc('_migration_placeholder').set({
            createdAt: timestamp,
            note: 'Placeholder document to ensure collection exists'
        });
        console.log('Created placeholder in vote_history collection');
        
        console.log('Migration 001 completed successfully');
    } catch (error) {
        console.error('Error running migration 001:', error);
        throw error;
    }
}

async function down() {
    console.log('Rolling back migration 001: Remove placeholder documents');
    
    try {
        // Remove the placeholder documents
        await db.collection(COLLECTIONS.USERS).doc('_migration_placeholder').delete();
        console.log('Removed placeholder from users collection');
        
        await db.collection(COLLECTIONS.ELECTIONS).doc('_migration_placeholder').delete();
        console.log('Removed placeholder from elections collection');
        
        await db.collection(COLLECTIONS.CANDIDATES).doc('_migration_placeholder').delete();
        console.log('Removed placeholder from candidates collection');
        
        await db.collection(COLLECTIONS.VOTES).doc('_migration_placeholder').delete();
        console.log('Removed placeholder from votes collection');
        
        await db.collection(COLLECTIONS.NOTIFICATIONS).doc('_migration_placeholder').delete();
        console.log('Removed placeholder from notifications collection');
        
        await db.collection(COLLECTIONS.VOTE_HISTORY).doc('_migration_placeholder').delete();
        console.log('Removed placeholder from vote_history collection');
        
        console.log('Rollback of migration 001 completed successfully');
    } catch (error) {
        console.error('Error rolling back migration 001:', error);
        throw error;
    }
}

module.exports = { up, down };