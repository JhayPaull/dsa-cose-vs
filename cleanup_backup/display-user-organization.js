const { db, COLLECTIONS } = require('./backend/config/database-firebase');

async function displayUserOrganization() {
    try {
        console.log('===========================================');
        console.log('USER ORGANIZATION IN FIREBASE DATABASE');
        console.log('===========================================\n');

        // Get all users from the database
        const usersSnapshot = await db.collection(COLLECTIONS.USERS).get();
        
        if (usersSnapshot.empty) {
            console.log('No users found in the database.');
            return;
        }

        // Organize users by role
        const admins = [];
        const subAdmins = [];
        const students = [];
        const otherRoles = [];

        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const user = {
                id: doc.id,
                ...userData
            };

            switch (userData.role) {
                case 'admin':
                    admins.push(user);
                    break;
                case 'sub-admin':
                    subAdmins.push(user);
                    break;
                case 'voter':
                    students.push(user);
                    break;
                default:
                    otherRoles.push(user);
                    break;
            }
        });

        // Display Admins
        console.log('👑 ADMINS (' + admins.length + ' users)');
        console.log('-------------------------------------------');
        if (admins.length === 0) {
            console.log('No admins found.\n');
        } else {
            admins.forEach((admin, index) => {
                console.log(`${index + 1}. ${admin.full_name || (admin.first_name + ' ' + admin.last_name)}`);
                console.log(`   Email: ${admin.email}`);
                console.log(`   Student ID: ${admin.student_id}`);
                console.log(`   Department: ${admin.department}`);
                console.log(`   User ID: ${admin.id}\n`);
            });
        }

        // Display Sub-Admins
        console.log('🛡️  SUB-ADMINS (' + subAdmins.length + ' users)');
        console.log('-------------------------------------------');
        if (subAdmins.length === 0) {
            console.log('No sub-admins found.\n');
        } else {
            subAdmins.forEach((subAdmin, index) => {
                console.log(`${index + 1}. ${subAdmin.full_name || (subAdmin.first_name + ' ' + subAdmin.last_name)}`);
                console.log(`   Email: ${subAdmin.email}`);
                console.log(`   Student ID: ${subAdmin.student_id}`);
                console.log(`   Department: ${subAdmin.department}`);
                console.log(`   Created by: ${subAdmin.created_by || 'Unknown'}`);
                console.log(`   User ID: ${subAdmin.id}\n`);
            });
        }

        // Display Students
        console.log('🎓 STUDENTS (' + students.length + ' users)');
        console.log('-------------------------------------------');
        if (students.length === 0) {
            console.log('No students found.\n');
        } else {
            students.forEach((student, index) => {
                console.log(`${index + 1}. ${student.full_name || (student.first_name + ' ' + student.last_name)}`);
                console.log(`   Email: ${student.email}`);
                console.log(`   Student ID: ${student.student_id}`);
                console.log(`   Department: ${student.department}`);
                console.log(`   Year: ${student.year || 'N/A'}`);
                console.log(`   Section: ${student.section || 'N/A'}`);
                console.log(`   User ID: ${student.id}\n`);
            });
        }

        // Display Other Roles (if any)
        if (otherRoles.length > 0) {
            console.log('❓ OTHER ROLES (' + otherRoles.length + ' users)');
            console.log('-------------------------------------------');
            otherRoles.forEach((user, index) => {
                console.log(`${index + 1}. ${user.full_name || (user.first_name + ' ' + user.last_name)}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Student ID: ${user.student_id}`);
                console.log(`   User ID: ${user.id}\n`);
            });
        }

        // Summary
        console.log('===========================================');
        console.log('SUMMARY');
        console.log('===========================================');
        console.log(`Total Users: ${usersSnapshot.size}`);
        console.log(`Admins: ${admins.length}`);
        console.log(`Sub-Admins: ${subAdmins.length}`);
        console.log(`Students: ${students.length}`);
        if (otherRoles.length > 0) {
            console.log(`Other Roles: ${otherRoles.length}`);
        }

        // Check notifications
        console.log('\n===========================================');
        console.log('NOTIFICATIONS SUMMARY');
        console.log('===========================================\n');

        const notificationsSnapshot = await db.collection(COLLECTIONS.NOTIFICATIONS).get();
        console.log(`Total Notifications: ${notificationsSnapshot.size}`);

        // Count notifications by type
        const notificationTypes = {};
        notificationsSnapshot.forEach(doc => {
            const notificationData = doc.data();
            const type = notificationData.type || 'unknown';
            notificationTypes[type] = (notificationTypes[type] || 0) + 1;
        });

        console.log('\nNotifications by Type:');
        for (const [type, count] of Object.entries(notificationTypes)) {
            console.log(`  ${type}: ${count}`);
        }

        console.log('\n===========================================');
        console.log('USER ORGANIZATION DISPLAY COMPLETE');
        console.log('===========================================\n');

    } catch (error) {
        console.error('❌ Error displaying user organization:', error);
        console.error('Error details:', error.message);
    } finally {
        // Exit the process
        process.exit(0);
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    displayUserOrganization().catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = { displayUserOrganization };