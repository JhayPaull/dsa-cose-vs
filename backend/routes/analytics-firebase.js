const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const VotingController = require('../controllers/VotingController');
const UserController = require('../controllers/UserController');
const ElectionController = require('../controllers/ElectionController');
const DatabaseController = require('../controllers/DatabaseController');

const router = express.Router();

// Get analytics data
router.get('/data', authenticateToken, async (req, res) => {
    try {
        // Get user statistics
        const userStats = await UserController.getVoteStatistics();
        const registeredVoters = userStats.totalVoters;
        
        // Get all votes
        const allVotes = await DatabaseController.getAllDocuments('votes');
        const totalVotes = allVotes.length;

        // Calculate voter turnout
        const voterTurnout = registeredVoters > 0 ? Math.round((userStats.votedUsers / registeredVoters) * 100) : 0;

        // Get election status
        const activeElections = await ElectionController.getActiveElections();
        const electionStatus = activeElections.length > 0 ? activeElections[0].status : 'No Active Election';

        // Get all votes with candidate info
        const candidateVoteCounts = {};
        allVotes.forEach(vote => {
            const candidateId = vote.candidateId;
            candidateVoteCounts[candidateId] = (candidateVoteCounts[candidateId] || 0) + 1;
        });

        // Get candidates and their vote counts
        const allCandidates = await DatabaseController.getAllDocuments('candidates');
        const voteDistribution = [];
        const candidates = [];

        allCandidates.forEach(candidate => {
            const votes = candidateVoteCounts[candidate.id] || 0;
            
            voteDistribution.push({
                candidate: `${candidate.firstName} ${candidate.lastName}`,
                position: candidate.position,
                votes: votes
            });

            candidates.push({
                name: `${candidate.firstName} ${candidate.lastName}`,
                position: candidate.position,
                votes: votes
            });
        });

        // Get voting trends (last 24 hours by hour)
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        const recentVotes = allVotes.filter(vote => {
            const voteDate = new Date(vote.timestamp);
            return voteDate >= oneDayAgo;
        });

        const hourlyVotes = {};
        recentVotes.forEach(vote => {
            const timestamp = new Date(vote.timestamp);
            const hour = timestamp.getHours();
            const hourKey = `${hour.toString().padStart(2, '0')}:00`;
            hourlyVotes[hourKey] = (hourlyVotes[hourKey] || 0) + 1;
        });

        const votingTrends = Object.keys(hourlyVotes).sort().map(time => ({
            time,
            count: hourlyVotes[time]
        }));

        // Get turnout data (by day for last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weekVotes = allVotes.filter(vote => {
            const voteDate = new Date(vote.timestamp);
            return voteDate >= sevenDaysAgo;
        });

        const dailyVotes = {};
        weekVotes.forEach(vote => {
            const timestamp = new Date(vote.timestamp);
            const dateKey = timestamp.toISOString().split('T')[0];
            dailyVotes[dateKey] = (dailyVotes[dateKey] || 0) + 1;
        });

        const turnoutData = Object.keys(dailyVotes).sort().map(period => ({
            period,
            count: dailyVotes[period],
            percentage: registeredVoters > 0 ? Math.round((dailyVotes[period] / registeredVoters) * 100 * 100) / 100 : 0
        }));

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
        const allVotes = await DatabaseController.getAllDocuments('votes');
        const candidateVoteCounts = {};

        allVotes.forEach(vote => {
            const candidateId = vote.candidateId;
            candidateVoteCounts[candidateId] = (candidateVoteCounts[candidateId] || 0) + 1;
        });

        const allCandidates = await DatabaseController.getAllDocuments('candidates');
        const totalVotes = allVotes.length;
        const analytics = [];

        allCandidates.forEach(candidate => {
            const votes = candidateVoteCounts[candidate.id] || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100 * 100) / 100 : 0;

            analytics.push({
                candidate: `${candidate.firstName} ${candidate.lastName}`,
                position: candidate.position,
                votes: votes,
                percentage: percentage
            });
        });

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

