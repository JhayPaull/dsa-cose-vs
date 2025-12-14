const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get active elections and candidates
router.get('/elections', authenticateToken, async (req, res) => {
    try {
        // Get active elections
        const [elections] = await pool.query(
            'SELECT * FROM elections WHERE status = "active" ORDER BY end_date DESC'
        );

        if (elections.length === 0) {
            return res.json({ elections: [], candidates: [] });
        }

        const electionIds = elections.map(e => e.id);

        // Get candidates for active elections
        const [candidates] = await pool.query(
            'SELECT * FROM candidates WHERE election_id IN (?) ORDER BY position, name',
            [electionIds]
        );

        // Check if user has already voted
        const [userVotes] = await pool.query(
            'SELECT election_id FROM votes WHERE user_id = ? AND election_id IN (?)',
            [req.user.id, electionIds]
        );

        const votedElectionIds = userVotes.map(v => v.election_id);
        const availableElections = elections.filter(e => !votedElectionIds.includes(e.id));

        res.json({
            elections: availableElections,
            candidates: candidates,
            hasVoted: votedElectionIds.length > 0
        });
    } catch (error) {
        console.error('Get elections error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit vote
router.post('/vote', authenticateToken, async (req, res) => {
    try {
        const { electionId, votes } = req.body;
        const userId = req.user.id;

        if (!electionId || !votes || Object.keys(votes).length === 0) {
            return res.status(400).json({ message: 'Invalid vote data' });
        }

        // Check if election is active
        const [elections] = await pool.query(
            'SELECT * FROM elections WHERE id = ? AND status = "active"',
            [electionId]
        );

        if (elections.length === 0) {
            return res.status(400).json({ message: 'Election not found or not active' });
        }

        // Check if user has already voted
        const [existingVotes] = await pool.query(
            'SELECT * FROM votes WHERE user_id = ? AND election_id = ?',
            [userId, electionId]
        );

        if (existingVotes.length > 0) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Insert votes
            for (const [position, candidateId] of Object.entries(votes)) {
                await connection.query(
                    'INSERT INTO votes (user_id, election_id, candidate_id) VALUES (?, ?, ?)',
                    [userId, electionId, candidateId]
                );

                // Update candidate vote count
                await connection.query(
                    'UPDATE candidates SET votes = votes + 1 WHERE id = ?',
                    [candidateId]
                );

                // Record in vote history
                await connection.query(
                    'INSERT INTO vote_history (election_id, candidate_id) VALUES (?, ?)',
                    [electionId, candidateId]
                );
            }

            await connection.commit();

            // Emit real-time update via Socket.IO
            const io = req.app.get('io');
            if (io) {
                io.to('vote-updates').emit('vote-update', {
                    electionId,
                    timestamp: new Date()
                });
            }

            // Create notification
            await pool.query(
                'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
                [userId, 'Vote Submitted', 'Your vote has been successfully submitted. Thank you for participating!', 'success']
            );

            res.json({ message: 'Vote submitted successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Vote submission error:', error);
        res.status(500).json({ message: 'Server error during vote submission' });
    }
});

module.exports = router;

