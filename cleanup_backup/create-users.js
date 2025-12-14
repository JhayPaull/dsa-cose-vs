const { db, COLLECTIONS, toFirestoreTimestamp } = require('./backend/config/database-firebase');
const bcrypt = require('bcryptjs');

async function createUsers() {
    try {
        console.log('Creating users in the database...\n');

        // Create Admin User
        console.log('1. Creating Admin User...');
        const adminData = {
            last_name: 'De Vera',
            first_name: 'John Hay',
            middle_initial: 'P',
            year: '4',
            section: 'A',
            department: 'Computer Science',
            full_name: 'John Hay P De Vera',
            student_id: 'ADMIN001',
            email: 'admin@tcc.edu.ph',
            password: await bcrypt.hash('Admin123!', 10),
            role: 'admin',
            created_at: toFirestoreTimestamp(new Date()),
            updated_at: toFirestoreTimestamp(new Date())
        };

        const adminRef = await db.collection(COLLECTIONS.USERS).add(adminData);
        const adminId = adminRef.id;
        console.log(`✅ Admin created successfully!`);
        console.log(`   User ID: ${adminId}`);
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Role: ${adminData.role}\n`);

        // Create Sub-Admin User
        console.log('2. Creating Sub-Admin User...');
        const subAdminData = {
            last_name: 'Smith',
            first_name: 'Robert',
            middle_initial: 'J',
            year: '3',
            section: 'B',
            department: 'Information Technology',
            full_name: 'Robert J Smith',
            student_id: 'SUBADMIN001',
            email: 'subadmin@tcc.edu.ph',
            password: await bcrypt.hash('SubAdmin123!', 10),
            role: 'sub-admin',
            created_by: adminId, // Link to admin who created this sub-admin
            created_at: toFirestoreTimestamp(new Date()),
            updated_at: toFirestoreTimestamp(new Date())
        };

        const subAdminRef = await db.collection(COLLECTIONS.USERS).add(subAdminData);
        const subAdminId = subAdminRef.id;
        console.log(`✅ Sub-Admin created successfully!`);
        console.log(`   User ID: ${subAdminId}`);
        console.log(`   Email: ${subAdminData.email}`);
        console.log(`   Role: ${subAdminData.role}`);
        console.log(`   Created by: ${subAdminData.created_by}\n`);

        // Create Student User
        console.log('3. Creating Student User...');
        const studentData = {
            last_name: 'Johnson',
            first_name: 'Emily',
            middle_initial: 'R',
            year: '2',
            section: 'C',
            department: 'Electronics Engineering',
            full_name: 'Emily R Johnson',
            student_id: 'STUDENT001',
            email: 'student@tcc.edu.ph',
            password: await bcrypt.hash('Student123!', 10),
            role: 'voter', // Default role for students
            created_at: toFirestoreTimestamp(new Date()),
            updated_at: toFirestoreTimestamp(new Date())
        };

        const studentRef = await db.collection(COLLECTIONS.USERS).add(studentData);
        const studentId = studentRef.id;
        console.log(`✅ Student created successfully!`);
        console.log(`   User ID: ${studentId}`);
        console.log(`   Email: ${studentData.email}`);
        console.log(`   Role: ${studentData.role}\n`);

        // Create welcome notifications for all users
        console.log('4. Creating welcome notifications...');
        
        // Welcome notification for Admin
        await db.collection(COLLECTIONS.NOTIFICATIONS).add({
            user_id: adminId,
            title: 'Welcome Admin!',
            message: 'Your admin account has been successfully created. You have full access to the system.',
            type: 'success',
            read: false,
            created_at: toFirestoreTimestamp(new Date())
        });

        // Welcome notification for Sub-Admin
        await db.collection(COLLECTIONS.NOTIFICATIONS).add({
            user_id: subAdminId,
            title: 'Welcome Sub-Admin!',
            message: 'Your sub-admin account has been successfully created by the system administrator.',
            type: 'success',
            read: false,
            created_at: toFirestoreTimestamp(new Date())
        });

        // Welcome notification for Student
        await db.collection(COLLECTIONS.NOTIFICATIONS).add({
            user_id: studentId,
            title: 'Welcome to TCC E-Voting System!',
            message: 'Your account has been successfully created. You can now participate in elections.',
            type: 'success',
            read: false,
            created_at: toFirestoreTimestamp(new Date())
        });

        console.log('✅ Welcome notifications created successfully!\n');

        console.log('===========================================');
        console.log('ALL USERS CREATED SUCCESSFULLY!');
        console.log('===========================================');
        console.log(`Admin ID: ${adminId}`);
        console.log(`Sub-Admin ID: ${subAdminId}`);
        console.log(`Student ID: ${studentId}`);
        console.log('===========================================');
        console.log('Default passwords:');
        console.log('- Admin: Admin123!');
        console.log('- Sub-Admin: SubAdmin123!');
        console.log('- Student: Student123!');
        console.log('===========================================');
        console.log('⚠️  IMPORTANT: Remember to change passwords after first login!');
        console.log('⚠️  For security, do not use default passwords in production.');

    } catch (error) {
        console.error('❌ Error creating users:', error);
        console.error('Error details:', error.message);
    } finally {
        // Exit the process
        process.exit(0);
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    createUsers().catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = { createUsers };