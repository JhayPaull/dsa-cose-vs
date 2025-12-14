const { db, COLLECTIONS } = require('./backend/config/database-firebase');

async function verifyUsers() {
    try {
        console.log('Verifying users in Firebase database...\n');

        // Query all users in the database
        const usersSnapshot = await db.collection(COLLECTIONS.USERS).get();
        
        if (usersSnapshot.empty) {
            console.log('No users found in the database.');
            return;
        }

        console.log(`Found ${usersSnapshot.size} users in the database:\n`);
        
        let userCount = 1;
        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            console.log(`${userCount}. User Document ID: ${doc.id}`);
            console.log(`   Name: ${userData.full_name || userData.first_name + ' ' + userData.last_name}`);
            console.log(`   Email: ${userData.email}`);
            console.log(`   Role: ${userData.role}`);
            console.log(`   Student ID: ${userData.student_id}`);
            console.log(`   Department: ${userData.department}`);
            console.log(`   Created At: ${userData.created_at ? userData.created_at.toDate() : 'N/A'}`);
            
            if (userData.role === 'sub-admin' && userData.created_by) {
                console.log(`   Created By: ${userData.created_by}`);
            }
            console.log('');
            userCount++;
        }

        // Specifically check for our created users
        console.log('===========================================');
        console.log('VERIFYING OUR CREATED USERS');
        console.log('===========================================\n');

        // Check for admin user
        const adminQuery = await db.collection(COLLECTIONS.USERS)
            .where('email', '==', 'admin@tcc.edu.ph')
            .get();
        
        if (!adminQuery.empty) {
            const adminDoc = adminQuery.docs[0];
            console.log('✅ Admin user found:');
            console.log(`   User ID: ${adminDoc.id}`);
            console.log(`   Email: ${adminDoc.data().email}`);
            console.log(`   Role: ${adminDoc.data().role}\n`);
        } else {
            console.log('❌ Admin user not found\n');
        }

        // Check for sub-admin user
        const subAdminQuery = await db.collection(COLLECTIONS.USERS)
            .where('email', '==', 'subadmin@tcc.edu.ph')
            .get();
        
        if (!subAdminQuery.empty) {
            const subAdminDoc = subAdminQuery.docs[0];
            console.log('✅ Sub-Admin user found:');
            console.log(`   User ID: ${subAdminDoc.id}`);
            console.log(`   Email: ${subAdminDoc.data().email}`);
            console.log(`   Role: ${subAdminDoc.data().role}\n`);
        } else {
            console.log('❌ Sub-Admin user not found\n');
        }

        // Check for student user
        const studentQuery = await db.collection(COLLECTIONS.USERS)
            .where('email', '==', 'student@tcc.edu.ph')
            .get();
        
        if (!studentQuery.empty) {
            const studentDoc = studentQuery.docs[0];
            console.log('✅ Student user found:');
            console.log(`   User ID: ${studentDoc.id}`);
            console.log(`   Email: ${studentDoc.data().email}`);
            console.log(`   Role: ${studentDoc.data().role}\n`);
        } else {
            console.log('❌ Student user not found\n');
        }

        // Check notifications
        console.log('===========================================');
        console.log('CHECKING NOTIFICATIONS');
        console.log('===========================================\n');

        const notificationsSnapshot = await db.collection(COLLECTIONS.NOTIFICATIONS).get();
        console.log(`Found ${notificationsSnapshot.size} notifications in the database:\n`);

        let notificationCount = 1;
        for (const doc of notificationsSnapshot.docs) {
            const notificationData = doc.data();
            console.log(`${notificationCount}. Notification ID: ${doc.id}`);
            console.log(`   User ID: ${notificationData.user_id}`);
            console.log(`   Title: ${notificationData.title}`);
            console.log(`   Message: ${notificationData.message}`);
            console.log(`   Type: ${notificationData.type}`);
            console.log(`   Created At: ${notificationData.created_at ? notificationData.created_at.toDate() : 'N/A'}\n`);
            notificationCount++;
        }

    } catch (error) {
        console.error('❌ Error verifying users:', error);
        console.error('Error details:', error.message);
    } finally {
        // Exit the process
        process.exit(0);
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    verifyUsers().catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = { verifyUsers };