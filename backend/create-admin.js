/**
 * Script to create an admin account
 * Run this script to create an initial admin user
 */

const bcrypt = require('bcryptjs');
const { db, COLLECTIONS, toFirestoreTimestamp } = require('./config/database-firebase');

async function createAdminAccount() {
    try {
        console.log('Creating admin account...');
        
        // Admin account details
        const adminData = {
            lastName: 'Admin',
            firstName: 'System',
            middleInitial: 'S',
            year: '4th Year',
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
                    console.log('  Found existing admin with email:', adminData.email);
                }
                if (!studentIdQuery.empty) {
                    console.log('  Found existing admin with student ID:', adminData.studentId);
                }
                return;
            }
        } catch (queryError) {
            console.log('⚠️  Could not query existing users (this might be OK if the collection is empty)');
            console.log('  Proceeding with admin account creation...');
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create admin user document
        console.log('Creating admin user document...');
        const userData = {
            last_name: adminData.lastName,
            first_name: adminData.firstName,
            middle_initial: adminData.middleInitial,
            year: adminData.year,
            section: adminData.section,
            department: adminData.department,
            full_name: `${adminData.firstName} ${adminData.middleInitial}. ${adminData.lastName}`,
            student_id: adminData.studentId,
            email: adminData.email,
            password: hashedPassword,
            role: 'admin',
            created_at: toFirestoreTimestamp(new Date()),
            updated_at: toFirestoreTimestamp(new Date())
        };

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

        console.log('\n✅ Admin account created successfully!');
        console.log('=====================================');
        console.log('User ID:', userId);
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);
        console.log('Role: admin');
        console.log('=====================================');
        console.log('⚠️  IMPORTANT: Remember to change the password after first login!');
        console.log('⚠️  For security, do not use the default password in production.');
        
    } catch (error) {
        console.error('❌ Error creating admin account:', error.message);
        console.error('Error details:', error);
        
        // Provide specific guidance based on the error
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            console.log('\n💡 This error typically occurs when:');
            console.log('1. The service account key is invalid');
            console.log('2. The Firebase project ID is incorrect');
            console.log('3. The Cloud Firestore API is not enabled');
            console.log('4. Network connectivity issues');
            console.log('\n🔧 To resolve this issue:');
            console.log('1. Go to Firebase Console (https://console.firebase.google.com)');
            console.log('2. Select your project: dsa-cose-vs');
            console.log('3. Go to Project Settings > Service Accounts');
            console.log('4. Click "Generate new private key"');
            console.log('5. Download the JSON file and save it as serviceAccountKey.json in the backend folder');
            console.log('6. Ensure Cloud Firestore API is enabled in Google Cloud Console');
            console.log('7. Check your network connection');
        }
    }
}

// Run the function
if (require.main === module) {
    createAdminAccount();
}

module.exports = { createAdminAccount };