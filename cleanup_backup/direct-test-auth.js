// Direct test of local authentication routes
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

// Test creating an admin account
function testCreateAdmin() {
    try {
        const userData = {
            lastName: 'Admin',
            firstName: 'System',
            middleInitial: '',
            year: '4',
            section: 'A',
            department: 'Computer Science',
            studentId: 'ADMIN003',
            email: 'admin3@example.com',
            password: 'admin123',
            role: 'admin',
            full_name: 'System Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Generate a simple ID
        userData.id = `mock_${Date.now()}`;

        // Load existing users
        let users = readMockUsers();
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === userData.email || u.student_id === userData.studentId);
        if (existingUser) {
            console.log('User already exists');
            return;
        }

        // Add new user
        users.push(userData);
        
        // Save to file
        fs.writeFileSync(MOCK_USERS_FILE, JSON.stringify(users, null, 2));
        
        console.log('Admin account created successfully!');
        console.log('User ID:', userData.id);
        console.log('Email:', userData.email);
    } catch (error) {
        console.error('Error creating admin account:', error.message);
    }
}

// Test login
function testLogin() {
    try {
        const email = 'admin3@example.com';
        const password = 'admin123';
        
        // Load users
        const users = readMockUsers();
        
        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            console.log('User not found');
            return;
        }
        
        // Check password
        if (user.password !== password) {
            console.log('Invalid password');
            return;
        }
        
        console.log('Login successful!');
        console.log('User:', user.full_name);
        console.log('Role:', user.role);
    } catch (error) {
        console.error('Error during login:', error.message);
    }
}

// Run tests
console.log('Testing local authentication routes...');
testCreateAdmin();
console.log('---');
testLogin();