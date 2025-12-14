const admin = require('firebase-admin');
const path = require('path');

// Try to initialize Firebase
try {
    const serviceAccount = require('./backend/serviceAccountKey.json');
    
    const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'dsa-cose-vs'
    });
    
    const db = admin.firestore();
    
    console.log('Firebase initialized successfully');
    
    // Test creating a document
    async function testFirestore() {
        try {
            const testDoc = await db.collection('test').add({
                message: 'Firebase connection test',
                timestamp: new Date()
            });
            
            console.log('Test document created with ID:', testDoc.id);
            
            // Clean up
            await db.collection('test').doc(testDoc.id).delete();
            console.log('Test document cleaned up');
            
            console.log('Firebase connection test passed!');
        } catch (error) {
            console.error('Firebase test failed:', error.message);
        }
    }
    
    testFirestore();
} catch (error) {
    console.error('Firebase initialization failed:', error.message);
}