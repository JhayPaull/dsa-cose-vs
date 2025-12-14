const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const UserController = require('../controllers/UserController');
const ElectionController = require('../controllers/ElectionController');
const VotingController = require('../controllers/VotingController');

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Get user statistics
        const userStats = await UserController.getVoteStatistics();
        const totalVoters = userStats.totalVoters;
        const votesCast = userStats.votedUsers;

        // Calculate turnout rate
        const turnoutRate = totalVoters > 0 ? Math.round((votesCast / totalVoters) * 100) : 0;

        // Get active elections
        const activeElections = await ElectionController.getActiveElections();
        let timeRemaining = '--:--';
        
        if (activeElections.length > 0) {
            const election = activeElections[0];
            const endDate = new Date(election.endDate);
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

        // Get recent activity (last 5 votes)
        const allVotes = await VotingController.getVotesByElection(activeElections.length > 0 ? activeElections[0].id : null);
        const recentVotes = allVotes.slice(0, 5);

        const activities = recentVotes.map(vote => ({
            title: 'Vote Cast',
            description: 'A vote was cast in the election',
            timestamp: vote.timestamp
        }));

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

