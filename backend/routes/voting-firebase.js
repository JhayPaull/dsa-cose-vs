const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const VotingController = require('../controllers/VotingController');
const ElectionController = require('../controllers/ElectionController');
const DatabaseController = require('../controllers/DatabaseController');

const router = express.Router();

// Rate limiting for voting
const rateLimit = require('express-rate-limit');

const voteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        message: 'Too many vote attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Get active elections and candidates
router.get('/elections', authenticateToken, async (req, res) => {
    try {
        // Get active elections
        const activeElections = await ElectionController.getActiveElections();

        if (activeElections.length === 0) {
            return res.json({ elections: [], candidates: [] });
        }

        const elections = activeElections;
        const electionIds = elections.map(e => e.id);

        // Get candidates for active elections
        const allCandidates = await DatabaseController.getAllDocuments('candidates');
        const candidates = allCandidates.filter(candidate => 
            electionIds.includes(candidate.electionId)
        );

        // Check if user has already voted
        const allUserVotes = await DatabaseController.getAllDocuments('votes', {
            userId: req.user.id
        });
        
        const userVotes = allUserVotes.filter(vote => 
            electionIds.includes(vote.electionId)
        );

        const votedElectionIds = userVotes.map(vote => vote.electionId);
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
router.post('/vote', voteLimiter, authenticateToken, async (req, res) => {
    try {
        const { electionId, votes } = req.body;
        const userId = req.user.id;

        if (!electionId || !votes || Object.keys(votes).length === 0) {
            return res.status(400).json({ message: 'Invalid vote data' });
        }

        // Check if election is active
        const election = await ElectionController.getElectionById(electionId);
        
        if (!election) {
            return res.status(400).json({ message: 'Election not found' });
        }

        if (election.status !== 'active') {
            return res.status(400).json({ message: 'Election is not active' });
        }

        // Validate that all positions in votes are valid for this election
        const candidates = await DatabaseController.getCandidatesByElection(electionId);
        
        const validCandidateIds = candidates.map(candidate => candidate.id);
        const validPositions = [...new Set(candidates.map(candidate => candidate.position))];
        
        // Check that all positions in votes are valid
        for (const position of Object.keys(votes)) {
            if (!validPositions.includes(position)) {
                return res.status(400).json({ message: `Invalid position: ${position}` });
            }
        }
        
        // Check that all candidate IDs are valid
        for (const candidateId of Object.values(votes)) {
            if (!validCandidateIds.includes(candidateId)) {
                return res.status(400).json({ message: `Invalid candidate ID: ${candidateId}` });
            }
        }

        // Cast votes
        const voteResults = [];
        for (const [position, candidateId] of Object.entries(votes)) {
            const voteData = {
                userId: userId,
                electionId: electionId,
                candidateId: candidateId,
                position: position,
                timestamp: new Date()
            };
            
            const voteResult = await VotingController.castVote(voteData);
            voteResults.push(voteResult);
        }

        // Emit real-time update via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.to('vote-updates').emit('vote-update', {
                electionId,
                timestamp: new Date()
            });
        }

        // Create notification
        await DatabaseController.createNotification({
            userId: userId,
            title: 'Vote Submitted',
            message: 'Your vote has been successfully submitted. Thank you for participating!',
            type: 'success',
            isRead: false,
            createdAt: new Date()
        });

        res.json({ message: 'Vote submitted successfully' });
    } catch (error) {
        console.error('Vote submission error:', error);
        
        if (error.message === 'User has already voted for this position in this election') {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }
        
        res.status(500).json({ message: 'Server error during vote submission' });
    }
});

module.exports = router;