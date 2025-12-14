// Seed file for initial users
const DatabaseController = require('../controllers/DatabaseController');

async function seedUsers() {
    try {
        console.log('Seeding initial users...');
        
        // Create admin user
        const adminUser = {
            email: 'admin@school.edu',
            firstName: 'Admin',
            lastName: 'User',
            studentId: 'ADMIN001',
            role: 'admin',
            gradeLevel: 'N/A',
            section: 'N/A',
            hasVoted: false,
            isActive: true
        };
        
        const createdAdmin = await DatabaseController.createUser(adminUser);
        console.log('Admin user created:', createdAdmin);
        
        // Create sample voters
        const sampleVoters = [
            {
                email: 'student1@school.edu',
                firstName: 'John',
                lastName: 'Doe',
                studentId: 'STU001',
                role: 'voter',
                gradeLevel: '11',
                section: 'A',
                hasVoted: false,
                isActive: true
            },
            {
                email: 'student2@school.edu',
                firstName: 'Jane',
                lastName: 'Smith',
                studentId: 'STU002',
                role: 'voter',
                gradeLevel: '12',
                section: 'B',
                hasVoted: false,
                isActive: true
            }
        ];
        
        for (const voterData of sampleVoters) {
            const createdVoter = await DatabaseController.createUser(voterData);
            console.log('Voter created:', createdVoter);
        }
        
        console.log('User seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedUsers().then(() => {
        console.log('User seeding process finished');
        process.exit(0);
    }).catch(error => {
        console.error('User seeding process failed:', error);
        process.exit(1);
    });
}

module.exports = seedUsers;