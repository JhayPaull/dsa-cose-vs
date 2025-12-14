// Simple Node.js script to test Docker container connection
const http = require('http');

console.log('Testing connection between frontend and backend Docker containers...');

// Test 1: Direct connection to backend on localhost
console.log('\n1. Testing direct connection to backend (localhost:3001)...');
const req1 = http.get('http://localhost:3001/api/health', (res) => {
    console.log(`   Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`   Response: ${data}`);
        console.log('   Direct connection test completed.');
    });
});

req1.on('error', (err) => {
    console.log('   Direct connection failed:', err.message);
});

// Test 2: Connection through Docker network (if running in container)
setTimeout(() => {
    console.log('\n2. Testing connection through Docker network (backend:3001)...');
    const req2 = http.get('http://backend:3001/api/health', (res) => {
        console.log(`   Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`   Response: ${data}`);
            console.log('   Docker network connection test completed.');
        });
    });
    
    req2.on('error', (err) => {
        console.log('   Docker network connection failed:', err.message);
    });
}, 2000);