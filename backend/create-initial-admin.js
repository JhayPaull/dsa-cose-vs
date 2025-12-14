/**
 * Script to create an initial admin account
 * Run this script after setting up the Firebase project
 */

const bcrypt = require('bcryptjs');
const { db, COLLECTIONS, toFirestoreTimestamp } = require('./config/database-firebase');

async function createInitialAdmin() {
    try {
        console.log('Creating initial admin account...');
        
        // Admin account details
        const adminData = {
            lastName: 'Administrator',
            firstName: 'System',
            middleInitial: '',
            year: '4',
            section: 'Admin',
            department: 'Administration',
            studentId: 'ADMIN001',
            email: 'admin@tcc.edu.ph',
            password: 'Admin123!' // Change this in production!
        };

        // Check if admin already exists
        console.log('Checking if admin account already exists...');
        const usersRef = db.collection(COLLECTIONS.USERS);
        
        try {
            const emailQuery = await usersRef.where('email', '==', adminData.email).get();
            const studentIdQuery = await usersRef.where('student_id', '==', adminData.studentId).get();

            if (!emailQuery.empty || !studentIdQuery.empty) {
                console.log('⚠️  Admin account already exists!');
                if (!emailQuery.empty) {
                    const userDoc = emailQuery.docs[0];
                    console.log('User ID:', userDoc.id);
                    console.log('Email:', userDoc.data().email);
                }
                return;
            }
        } catch (queryError) {
            console.error('Query error:', queryError);
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create admin user document
        const userData = {
            last_name: adminData.lastName,
            first_name: adminData.firstName,
            middle_initial: adminData.middleInitial,
            year: adminData.year,
            section: adminData.section,
            department: adminData.department,
            full_name: `${adminData.firstName} ${adminData.lastName}`,
            student_id: adminData.studentId,
            email: adminData.email,
            password: hashedPassword,
            role: 'admin',
            created_at: toFirestoreTimestamp(new Date()),
            updated_at: toFirestoreTimestamp(new Date())
        };

        console.log('Creating admin account...');
        const userRef = await usersRef.add(userData);
        const userId = userRef.id;

        // Create welcome notification
        console.log('Creating welcome notification...');
        await db.collection(COLLECTIONS.NOTIFICATIONS).add({
            user_id: userId,
            title: 'Welcome Admin!',
            message: 'Your admin account has been successfully created.',
            type: 'success',
            read: false,
            created_at: toFirestoreTimestamp(new Date())
        });

        console.log('\n✅ Initial admin account created successfully!');
        console.log('=====================================');
        console.log('User ID:', userId);
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);
        console.log('Role: admin');
        console.log('=====================================');
        console.log('⚠️  IMPORTANT: Remember to change the password after first login!');
        console.log('⚠️  For security, do not use the default password in production.');
        
    } catch (error) {
        console.error('Error creating admin account:', error);
        console.error('Error details:', error.message);
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    createInitialAdmin().then(() => {
        console.log('Script completed.');
        process.exit(0);
    }).catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = { createInitialAdmin };