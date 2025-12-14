// Script to create an admin account
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

// Create admin account
function createAdminAccount() {
    try {
        const adminData = {
            id: `mock_${Date.now()}`,
            lastName: 'Admin',
            firstName: 'System',
            middleInitial: '',
            year: '4',
            section: 'A',
            department: 'Computer Science',
            student_id: 'ADMIN005',
            email: 'admin5@example.com',
            password: 'admin123',
            role: 'admin',
            full_name: 'System Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Load existing users
        let users = readMockUsers();
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === adminData.email || u.student_id === adminData.student_id);
        if (existingUser) {
            console.log('Admin account already exists with this email or student ID');
            return;
        }

        // Add new admin user
        users.push(adminData);
        
        // Save to file
        fs.writeFileSync(MOCK_USERS_FILE, JSON.stringify(users, null, 2));
        
        console.log('Admin account created successfully!');
        console.log('Email:', adminData.email);
        console.log('Password: admin123');
        console.log('User ID:', adminData.id);
        console.log('');
        console.log('You can now log in to the application with these credentials.');
    } catch (error) {
        console.error('Error creating admin account:', error.message);
    }
}

createAdminAccount();