const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create a mock admin account
async function createMockAdmin() {
    try {
        // Create a simple admin user object
        const adminUser = {
            id: 'admin001',
            lastName: 'Admin',
            firstName: 'System',
            middleInitial: '',
            year: '4',
            section: 'A',
            department: 'Computer Science',
            student_id: 'ADMIN001',
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin',
            full_name: 'System Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save to a local file
        const usersFile = path.join(__dirname, 'mock-users.json');
        let users = [];
        
        // Load existing users if file exists
        if (fs.existsSync(usersFile)) {
            const fileContent = fs.readFileSync(usersFile, 'utf8');
            users = JSON.parse(fileContent);
        }
        
        // Add admin user
        users.push(adminUser);
        
        // Save to file
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        
        console.log('Mock admin account created successfully!');
        console.log('User ID:', adminUser.id);
        console.log('Email:', adminUser.email);
        console.log('Password: admin123 (hashed in file)');
        console.log('Role:', adminUser.role);
        console.log('');
        console.log('Users saved to:', usersFile);
    } catch (error) {
        console.error('Error creating mock admin account:', error.message);
    }
}

createMockAdmin();