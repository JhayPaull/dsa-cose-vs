// Simple test to verify Firebase connection
const { db } = require('./backend/config/firebase');

async function testConnection() {
    try {
        // Try to read from the users collection
        const usersRef = db.collection('users');
        const snapshot = await usersRef.limit(1).get();
        
        console.log('Firebase connection successful!');
        console.log(`Found ${snapshot.size} user documents (if any)`);
        
        // Try to write a test document
        const testDoc = await db.collection('test').add({
            message: 'Firebase connection test',
            timestamp: new Date()
        });
        
        console.log('Test document created with ID:', testDoc.id);
        
        // Clean up
        await db.collection('test').doc(testDoc.id).delete();
        console.log('Test document cleaned up');
        
        console.log('All tests passed!');
    } catch (error) {
        console.error('Firebase connection test failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
    }
}

testConnection();