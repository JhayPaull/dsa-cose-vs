// Comprehensive test script to verify frontend-backend connection
const http = require('http');
const { db, admin } = require('./backend/config/firebase');

async function testFrontendBackendConnection() {
    console.log('🧪 Testing Frontend-Backend Connection...\n');
    
    // Test 1: Backend API Health Check
    console.log('📋 Test 1: Backend API Health Check');
    try {
        const healthOptions = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/health',
            method: 'GET'
        };
        
        const healthResult = await new Promise((resolve, reject) => {
            const req = http.request(healthOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve({ statusCode: res.statusCode, data: jsonData });
                    } catch (error) {
                        reject({ error: 'Failed to parse response', details: error.message });
                    }
                });
            });
            req.on('error', (error) => reject({ error: 'Request failed', details: error.message }));
            req.end();
        });
        
        if (healthResult.statusCode === 200) {
            console.log('   ✅ Health check passed');
            console.log(`   📊 Status: ${healthResult.data.message}`);
            console.log(`   🗄️  Database: ${healthResult.data.database}`);
        } else {
            console.log('   ❌ Health check failed');
            console.log(`   📛 Status Code: ${healthResult.statusCode}`);
        }
    } catch (error) {
        console.log('   ❌ Health check failed');
        console.log(`   💥 Error: ${error.error} - ${error.details}`);
    }
    
    // Test 2: Firebase Connection
    console.log('\n📋 Test 2: Firebase Connection');
    try {
        // Test Firestore connection by listing collections
        const collections = await db.listCollections();
        console.log('   ✅ Firestore connection successful');
        console.log(`   📁 Found ${collections.length} collections`);
        
        // Test Firebase Admin SDK
        console.log('   ✅ Firebase Admin SDK initialized');
        console.log(`   🆔 Project ID: ${admin.instanceId().app.options.projectId}`);
    } catch (error) {
        console.log('   ❌ Firebase connection failed');
        console.log(`   💥 Error: ${error.message}`);
    }
    
    // Test 3: API Endpoints Availability
    console.log('\n📋 Test 3: API Endpoints Availability');
    const endpoints = [
        { name: 'Authentication', path: '/api/auth/me' },
        { name: 'Dashboard', path: '/api/dashboard/stats' },
        { name: 'Voting', path: '/api/voting/elections' },
        { name: 'Analytics', path: '/api/analytics/data' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const options = {
                hostname: 'localhost',
                port: 3001,
                path: endpoint.path,
                method: 'GET'
            };
            
            // We expect these to return 401 (unauthorized) since we're not authenticated
            // But that's still a successful connection
            await new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    resolve(res.statusCode);
                });
                req.on('error', (error) => reject(error));
                req.end();
            });
            
            console.log(`   ✅ ${endpoint.name} endpoint accessible`);
        } catch (error) {
            console.log(`   ❌ ${endpoint.name} endpoint failed`);
            console.log(`      💥 Error: ${error.message}`);
        }
    }
    
    // Test 4: Docker Container Status (if running in Docker environment)
    console.log('\n📋 Test 4: Docker Environment Check');
    try {
        // Check if we're in a Docker container by looking for .dockerenv file
        const fs = require('fs');
        if (fs.existsSync('/.dockerenv')) {
            console.log('   ✅ Running in Docker container');
        } else {
            console.log('   ⚠️  Not running in Docker container (this is OK for local development)');
        }
    } catch (error) {
        console.log('   ⚠️  Unable to determine Docker environment');
    }
    
    console.log('\n🏁 Frontend-Backend Connection Tests Complete!');
    console.log('📝 Note: Some API endpoints may return 401 Unauthorized, which is expected for unauthenticated requests.');
    console.log('✅ As long as the endpoints are reachable, the connection is working properly.');
}

// Run the test if this file is executed directly
if (require.main === module) {
    testFrontendBackendConnection()
        .then(() => {
            console.log('\n🎉 All tests completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Test suite failed:', error);
            process.exit(1);
        });
}

module.exports = testFrontendBackendConnection;