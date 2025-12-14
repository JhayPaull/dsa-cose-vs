// Script to run migrations
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    console.log('Starting migrations...');
    
    // Get all migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.match(/^\d+_.+\.js$/) && file !== 'run-migrations.js')
        .sort();
    
    console.log(`Found ${migrationFiles.length} migrations to run`);
    
    for (const file of migrationFiles) {
        console.log(`Running migration: ${file}`);
        try {
            const migration = require(path.join(migrationsDir, file));
            if (typeof migration.up === 'function') {
                await migration.up();
                console.log(`✓ Completed migration: ${file}`);
            } else {
                console.log(`⚠ Migration ${file} does not have an up() function`);
            }
        } catch (error) {
            console.error(`✗ Error running migration ${file}:`, error);
            process.exit(1);
        }
    }
    
    console.log('All migrations completed successfully!');
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations().catch(error => {
        console.error('Migration process failed:', error);
        process.exit(1);
    });
}

module.exports = runMigrations;