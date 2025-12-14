const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Get total voters
        const [voterCount] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "voter"');
        const totalVoters = voterCount[0].count;

        // Get total votes cast
        const [voteCount] = await pool.query('SELECT COUNT(*) as count FROM votes');
        const votesCast = voteCount[0].count;

        // Calculate turnout rate
        const turnoutRate = totalVoters > 0 ? Math.round((votesCast / totalVoters) * 100) : 0;

        // Get active election
        const [elections] = await pool.query(
            'SELECT * FROM elections WHERE status = "active" ORDER BY end_date DESC LIMIT 1'
        );

        let timeRemaining = '--:--';
        if (elections.length > 0) {
            const endDate = new Date(elections[0].end_date);
            const now = new Date();
            const diff = endDate - now;

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                timeRemaining = `${hours}:${minutes.toString().padStart(2, '0')}`;
            } else {
                timeRemaining = 'Ended';
            }
        }

        // Get recent activity
        const [activities] = await pool.query(`
            SELECT 
                'Vote Cast' as title,
                CONCAT('A vote was cast in the election') as description,
                created_at as timestamp
            FROM votes
            ORDER BY created_at DESC
            LIMIT 5
        `);

        res.json({
            totalVoters,
            votesCast,
            turnoutRate,
            timeRemaining,
            recentActivity: activities
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

