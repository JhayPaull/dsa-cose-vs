// Master seed file to run all seed scripts
const seedUsers = require('./seed-users');
const seedElections = require('./seed-elections');

async function seedAll() {
    try {
        console.log('Starting complete database seeding process...');
        
        // Seed users first (as other data may depend on users)
        await seedUsers();
        
        // Seed elections
        await seedElections();
        
        console.log('All seeding completed successfully!');
    } catch (error) {
        console.error('Error in seeding process:', error);
        process.exit(1);
    }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedAll().then(() => {
        console.log('Complete seeding process finished');
        process.exit(0);
    }).catch(error => {
        console.error('Complete seeding process failed:', error);
        process.exit(1);
    });
}

module.exports = seedAll;