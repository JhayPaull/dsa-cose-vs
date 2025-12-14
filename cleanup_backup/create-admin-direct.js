const { db, admin, COLLECTIONS } = require('./backend/config/firebase');
const bcrypt = require('bcryptjs');

async function createAdminAccount() {
    try {
        const adminData = {
            lastName: 'Admin',
            firstName: 'System',
            middleInitial: '',
            year: '4',
            section: 'A',
            department: 'Computer Science',
            studentId: 'ADMIN001',
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin',
            full_name: 'System Admin',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        };

        // Create the admin user
        const userRef = await db.collection(COLLECTIONS.USERS).add(adminData);
        console.log('Admin account created successfully!');
        console.log('User ID:', userRef.id);
        
        // Create a welcome notification
        try {
            await db.collection(COLLECTIONS.NOTIFICATIONS).add({
                user_id: userRef.id,
                title: 'Welcome Admin!',
                message: 'Your admin account has been successfully created.',
                type: 'success',
                read: false,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('Welcome notification created');
        } catch (notificationError) {
            console.error('Non-critical error creating admin notification:', notificationError.message);
        }
    } catch (error) {
        console.error('Error creating admin account:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

createAdminAccount();