const fs = require('fs');
const path = require('path');

// Create a simple admin account
function createSimpleAdmin() {
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
            password: 'admin123', // In a real app, this would be hashed
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
        
        console.log('Simple admin account created successfully!');
        console.log('User ID:', adminUser.id);
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);
        console.log('Role:', adminUser.role);
        console.log('');
        console.log('Users saved to:', usersFile);
    } catch (error) {
        console.error('Error creating simple admin account:', error.message);
    }
}

createSimpleAdmin();