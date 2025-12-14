const { db, COLLECTIONS, toFirestoreTimestamp } = require('./backend/config/database-firebase');

async function updateUsers() {
    try {
        console.log('Updating users in Firebase database...\n');

        // 1. Update Admin User Information
        console.log('1. Updating Admin User...');
        
        // First, let's find our admin user by email
        const adminQuery = await db.collection(COLLECTIONS.USERS)
            .where('email', '==', 'admin@tcc.edu.ph')
            .where('first_name', '==', 'John Hay')
            .get();
        
        if (!adminQuery.empty) {
            const adminDoc = adminQuery.docs[0];
            const adminId = adminDoc.id;
            
            // Update admin user information
            await db.collection(COLLECTIONS.USERS).doc(adminId).update({
                department: 'Computer Science',
                year: '4',
                section: 'A',
                updated_at: toFirestoreTimestamp(new Date())
            });
            
            console.log(`✅ Admin user updated successfully!`);
            console.log(`   User ID: ${adminId}`);
            console.log(`   Email: admin@tcc.edu.ph\n`);
        } else {
            console.log('❌ Admin user not found\n');
        }

        // 2. Update Sub-Admin User Information
        console.log('2. Updating Sub-Admin User...');
        
        // Find sub-admin user by email
        const subAdminQuery = await db.collection(COLLECTIONS.USERS)
            .where('email', '==', 'subadmin@tcc.edu.ph')
            .get();
        
        if (!subAdminQuery.empty) {
            const subAdminDoc = subAdminQuery.docs[0];
            const subAdminId = subAdminDoc.id;
            
            // Update sub-admin user information
            await db.collection(COLLECTIONS.USERS).doc(subAdminId).update({
                department: 'Information Technology',
                year: '3',
                section: 'B',
                updated_at: toFirestoreTimestamp(new Date())
            });
            
            console.log(`✅ Sub-Admin user updated successfully!`);
            console.log(`   User ID: ${subAdminId}`);
            console.log(`   Email: subadmin@tcc.edu.ph\n`);
        } else {
            console.log('❌ Sub-Admin user not found\n');
        }

        // 3. Update Student User Information
        console.log('3. Updating Student User...');
        
        // Find student user by email
        const studentQuery = await db.collection(COLLECTIONS.USERS)
            .where('email', '==', 'student@tcc.edu.ph')
            .get();
        
        if (!studentQuery.empty) {
            const studentDoc = studentQuery.docs[0];
            const studentId = studentDoc.id;
            
            // Update student user information
            await db.collection(COLLECTIONS.USERS).doc(studentId).update({
                department: 'Electronics Engineering',
                year: '2',
                section: 'C',
                updated_at: toFirestoreTimestamp(new Date())
            });
            
            console.log(`✅ Student user updated successfully!`);
            console.log(`   User ID: ${studentId}`);
            console.log(`   Email: student@tcc.edu.ph\n`);
        } else {
            console.log('❌ Student user not found\n');
        }

        // 4. Add additional information to all users if needed
        console.log('4. Adding additional information to users...');
        
        // Update all users with a last_updated field
        const allUsersSnapshot = await db.collection(COLLECTIONS.USERS).get();
        
        for (const doc of allUsersSnapshot.docs) {
            await db.collection(COLLECTIONS.USERS).doc(doc.id).update({
                last_updated: toFirestoreTimestamp(new Date())
            });
        }
        
        console.log(`✅ Added last_updated field to all ${allUsersSnapshot.size} users\n`);

        // 5. Create update notification for the users we specifically updated
        console.log('5. Creating update notifications...');
        
        // Notification for Admin
        if (!adminQuery.empty) {
            const adminId = adminQuery.docs[0].id;
            await db.collection(COLLECTIONS.NOTIFICATIONS).add({
                user_id: adminId,
                title: 'Profile Updated',
                message: 'Your admin profile information has been successfully updated in the system.',
                type: 'info',
                read: false,
                created_at: toFirestoreTimestamp(new Date())
            });
        }

        // Notification for Sub-Admin
        if (!subAdminQuery.empty) {
            const subAdminId = subAdminQuery.docs[0].id;
            await db.collection(COLLECTIONS.NOTIFICATIONS).add({
                user_id: subAdminId,
                title: 'Profile Updated',
                message: 'Your sub-admin profile information has been successfully updated in the system.',
                type: 'info',
                read: false,
                created_at: toFirestoreTimestamp(new Date())
            });
        }

        // Notification for Student
        if (!studentQuery.empty) {
            const studentId = studentQuery.docs[0].id;
            await db.collection(COLLECTIONS.NOTIFICATIONS).add({
                user_id: studentId,
                title: 'Profile Updated',
                message: 'Your student profile information has been successfully updated in the system.',
                type: 'info',
                read: false,
                created_at: toFirestoreTimestamp(new Date())
            });
        }

        console.log('✅ Update notifications created successfully!\n');

        console.log('===========================================');
        console.log('ALL USERS UPDATED SUCCESSFULLY IN FIREBASE!');
        console.log('===========================================');

    } catch (error) {
        console.error('❌ Error updating users:', error);
        console.error('Error details:', error.message);
    } finally {
        // Exit the process
        process.exit(0);
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    updateUsers().catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = { updateUsers };