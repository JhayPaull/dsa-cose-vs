const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tcc_evoting',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database tables
async function initializeDatabase() {
    try {
        // Users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                student_id VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('voter', 'admin') DEFAULT 'voter',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Elections table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS elections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                start_date DATETIME NOT NULL,
                end_date DATETIME NOT NULL,
                status ENUM('upcoming', 'active', 'ended') DEFAULT 'upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Candidates table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                election_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                party VARCHAR(255),
                bio TEXT,
                photo_url VARCHAR(500),
                votes INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE
            )
        `);

        // Votes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                election_id INT NOT NULL,
                candidate_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
                FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_election (user_id, election_id)
            )
        `);

        // Notifications table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type ENUM('info', 'success', 'warning', 'error', 'vote', 'election') DEFAULT 'info',
                read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Vote history for analytics
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vote_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                election_id INT NOT NULL,
                candidate_id INT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
                FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
            )
        `);

        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Initialize on module load
initializeDatabase();

module.exports = pool;

