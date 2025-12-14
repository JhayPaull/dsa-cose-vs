async function createAdminAccount() {
    const adminData = {
        lastName: 'Admin',
        firstName: 'System',
        middleInitial: '',
        year: '4',
        section: 'A',
        department: 'Computer Science',
        studentId: 'ADMIN001',
        email: 'admin@example.com',
        password: 'admin123'
    };

    try {
        const response = await fetch('http://localhost:3001/api/auth/create-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Admin account created successfully!');
            console.log('User ID:', data.userId);
        } else {
            console.error('Error creating admin account:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

createAdminAccount();