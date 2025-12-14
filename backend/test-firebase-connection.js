// Test script to verify Firebase connection
const { db, admin } = require('./config/firebase');

async function testFirebaseConnection() {
    console.log('Testing Firebase connection...');
    
    try {
        // Test Firestore connection by listing collections
        const collections = await db.listCollections();
        console.log('✓ Firestore connection successful');
        console.log(`Found ${collections.length} collections:`);
        collections.forEach(collection => {
            console.log(`  - ${collection.id}`);
        });
        
        // Test Firebase Admin SDK
        console.log('✓ Firebase Admin SDK initialized');
        console.log(`Project ID: ${admin.instanceId().app.options.projectId}`);
        
        console.log('\n✅ All Firebase connection tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error.message);
        console.error('Please ensure you have:');
        console.error('1. A valid service account key file (serviceAccountKey.json)');
        console.error('2. Proper environment variables set');
        console.error('3. Network connectivity to Firebase');
        process.exit(1);
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testFirebaseConnection();
}

module.exports = testFirebaseConnection;