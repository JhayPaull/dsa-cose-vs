const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get analytics data
router.get('/data', authenticateToken, async (req, res) => {
    try {
        // Get total votes
        const [voteCount] = await pool.query('SELECT COUNT(*) as count FROM votes');
        const totalVotes = voteCount[0].count;

        // Get registered voters
        const [voterCount] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "voter"');
        const registeredVoters = voterCount[0].count;

        // Calculate voter turnout
        const voterTurnout = registeredVoters > 0 ? Math.round((totalVotes / registeredVoters) * 100) : 0;

        // Get election status
        const [elections] = await pool.query(
            'SELECT status FROM elections WHERE status = "active" LIMIT 1'
        );
        const electionStatus = elections.length > 0 ? elections[0].status : 'No Active Election';

        // Get vote distribution
        const [voteDistribution] = await pool.query(`
            SELECT 
                c.name as candidate,
                c.position,
                COUNT(v.id) as votes
            FROM candidates c
            LEFT JOIN votes v ON c.id = v.candidate_id
            GROUP BY c.id, c.name, c.position
            ORDER BY votes DESC
        `);

        // Get voting trends (last 24 hours by hour)
        const [votingTrends] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%H:00') as time,
                COUNT(*) as count
            FROM votes
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            GROUP BY DATE_FORMAT(created_at, '%H:00')
            ORDER BY time
        `);

        // Get turnout data (by day for last 7 days)
        const [turnoutData] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as period,
                COUNT(*) as count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users WHERE role = 'voter')), 2) as percentage
            FROM votes
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
            ORDER BY period
        `);

        // Get candidate performance
        const [candidates] = await pool.query(`
            SELECT 
                c.name,
                c.position,
                COUNT(v.id) as votes
            FROM candidates c
            LEFT JOIN votes v ON c.id = v.candidate_id
            GROUP BY c.id, c.name, c.position
            ORDER BY votes DESC
        `);

        res.json({
            totalVotes,
            registeredVoters,
            voterTurnout,
            electionStatus,
            voteDistribution,
            votingTrends,
            turnoutData,
            candidates
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export report
router.get('/export', authenticateToken, async (req, res) => {
    try {
        // For now, return JSON. In production, generate PDF
        const [analytics] = await pool.query(`
            SELECT 
                c.name as candidate,
                c.position,
                COUNT(v.id) as votes,
                ROUND((COUNT(v.id) * 100.0 / (SELECT COUNT(*) FROM votes)), 2) as percentage
            FROM candidates c
            LEFT JOIN votes v ON c.id = v.candidate_id
            GROUP BY c.id, c.name, c.position
            ORDER BY votes DESC
        `);

        res.json({
            report: 'Election Report',
            generatedAt: new Date().toISOString(),
            data: analytics
        });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

