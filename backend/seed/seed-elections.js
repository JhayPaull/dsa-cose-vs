// Seed file for initial elections
const DatabaseController = require('../controllers/DatabaseController');

async function seedElections() {
    try {
        console.log('Seeding initial elections...');
        
        // Create sample election
        const sampleElection = {
            title: 'School President Election 2024',
            description: 'Annual school election for president and other positions',
            startDate: new Date('2024-05-01'),
            endDate: new Date('2024-05-07'),
            status: 'active',
            createdBy: 'ADMIN001', // This should be replaced with actual admin user ID
            votingStartTime: new Date('2024-05-01T08:00:00'),
            votingEndTime: new Date('2024-05-07T17:00:00'),
            isPublic: true
        };
        
        const createdElection = await DatabaseController.createElection(sampleElection);
        console.log('Election created:', createdElection);
        
        console.log('Election seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding elections:', error);
    }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedElections().then(() => {
        console.log('Election seeding process finished');
        process.exit(0);
    }).catch(error => {
        console.error('Election seeding process failed:', error);
        process.exit(1);
    });
}

module.exports = seedElections;