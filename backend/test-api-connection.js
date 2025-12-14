// Test script to verify API connection
const http = require('http');

async function testApiConnection() {
    console.log('Testing API connection...');
    
    // Test the health endpoint
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/health',
        method: 'GET'
    };
    
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log('✓ API connection successful');
                    console.log(`Status: ${jsonData.message}`);
                    console.log(`Database: ${jsonData.database}`);
                    console.log(`Timestamp: ${jsonData.timestamp}`);
                    resolve(true);
                } catch (error) {
                    console.error('❌ Failed to parse API response:', error.message);
                    reject(false);
                }
            });
        });
        
        req.on('error', (error) => {
            console.error('❌ API connection failed:', error.message);
            console.error('Please ensure the backend server is running on port 3001');
            reject(false);
        });
        
        req.end();
    });
}

// Run the test if this file is executed directly
if (require.main === module) {
    testApiConnection()
        .then(() => {
            console.log('\n✅ All API connection tests passed!');
            process.exit(0);
        })
        .catch(() => {
            console.log('\n❌ API connection test failed!');
            process.exit(1);
        });
}

module.exports = testApiConnection;