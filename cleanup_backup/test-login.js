// Script to test login functionality
const fs = require('fs');
const path = require('path');

// Mock users file path
const MOCK_USERS_FILE = path.join(__dirname, 'mock-users.json');

// Helper function to read mock users
function readMockUsers() {
    try {
        if (fs.existsSync(MOCK_USERS_FILE)) {
            const fileContent = fs.readFileSync(MOCK_USERS_FILE, 'utf8');
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error('Error reading mock users file:', error.message);
    }
    return [];
}

// Test login
function testLogin(email, password) {
    try {
        // Load users
        const users = readMockUsers();
        
        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            console.log('Login failed: User not found');
            return false;
        }
        
        // Check password
        if (user.password !== password) {
            console.log('Login failed: Invalid password');
            return false;
        }
        
        console.log('Login successful!');
        console.log('Welcome,', user.full_name || user.firstName + ' ' + user.lastName);
        console.log('Role:', user.role);
        console.log('Email:', user.email);
        
        return true;
    } catch (error) {
        console.error('Error during login:', error.message);
        return false;
    }
}

// Test with our newly created admin account
console.log('Testing login with admin5@example.com...');
const success = testLogin('admin5@example.com', 'admin123');

if (success) {
    console.log('\nYou can now access the application with these credentials:');
    console.log('Email: admin5@example.com');
    console.log('Password: admin123');
} else {
    console.log('\nLogin failed. Please check your credentials.');
}