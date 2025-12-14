// Voting Controller for Voting Operations
const DatabaseController = require('./DatabaseController');

class VotingController {
    // Cast a vote
    async castVote(voteData) {
        try {
            // Validate that user hasn't already voted for this position in this election
            const existingVotes = await DatabaseController.getAllDocuments('votes', {
                userId: voteData.userId,
                electionId: voteData.electionId,
                position: voteData.position
            });
            
            if (existingVotes.length > 0) {
                throw new Error('User has already voted for this position in this election');
            }
            
            // Create the vote
            const vote = await DatabaseController.createVote(voteData);
            
            // Mark user as having voted if this is their first vote in this election
            const userVotes = await DatabaseController.getAllDocuments('votes', {
                userId: voteData.userId,
                electionId: voteData.electionId
            });
            
            if (userVotes.length === 1) {
                await DatabaseController.updateUser(voteData.userId, { hasVoted: true });
            }
            
            // Increment candidate vote count
            const candidate = await DatabaseController.getDocumentById('candidates', voteData.candidateId);
            if (candidate) {
                const newVoteCount = (candidate.voteCount || 0) + 1;
                await DatabaseController.updateDocument('candidates', voteData.candidateId, { voteCount: newVoteCount });
            }
            
            return vote;
        } catch (error) {
            console.error('Error casting vote:', error);
            throw error;
        }
    }

    // Get votes by user
    async getVotesByUser(userId) {
        try {
            return await DatabaseController.getAllDocuments('votes', { userId });
        } catch (error) {
            console.error('Error getting votes by user:', error);
            throw error;
        }
    }

    // Get votes by election
    async getVotesByElection(electionId) {
        try {
            return await DatabaseController.getVotesByElection(electionId);
        } catch (error) {
            console.error('Error getting votes by election:', error);
            throw error;
        }
    }

    // Get votes by candidate
    async getVotesByCandidate(candidateId) {
        try {
            return await DatabaseController.getAllDocuments('votes', { candidateId });
        } catch (error) {
            console.error('Error getting votes by candidate:', error);
            throw error;
        }
    }

    // Get vote by ID
    async getVoteById(voteId) {
        try {
            const vote = await DatabaseController.getDocumentById('votes', voteId);
            if (!vote) {
                throw new Error('Vote not found');
            }
            return vote;
        } catch (error) {
            console.error('Error getting vote by ID:', error);
            throw error;
        }
    }

    // Verify vote
    async verifyVote(voteId) {
        try {
            return await DatabaseController.updateDocument('votes', voteId, { isVerified: true });
        } catch (error) {
            console.error('Error verifying vote:', error);
            throw error;
        }
    }

    // Get real-time vote counts for an election
    async getRealTimeVoteCounts(electionId) {
        try {
            // Get all votes for this election
            const votes = await this.getVotesByElection(electionId);
            
            // Get all candidates for this election
            const candidates = await DatabaseController.getAllDocuments('candidates', { electionId });
            
            // Initialize vote counts
            const voteCounts = {};
            candidates.forEach(candidate => {
                voteCounts[candidate.id] = {
                    candidateId: candidate.id,
                    candidateName: `${candidate.firstName} ${candidate.lastName}`,
                    position: candidate.position,
                    voteCount: 0
                };
            });
            
            // Count votes
            votes.forEach(vote => {
                if (voteCounts[vote.candidateId]) {
                    voteCounts[vote.candidateId].voteCount++;
                }
            });
            
            return Object.values(voteCounts);
        } catch (error) {
            console.error('Error getting real-time vote counts:', error);
            throw error;
        }
    }

    // Get voting statistics
    async getVotingStatistics(electionId) {
        try {
            // Get all votes for this election
            const votes = await this.getVotesByElection(electionId);
            
            // Get all users
            const users = await DatabaseController.getAllUsers();
            const voters = users.filter(user => user.role === 'voter');
            
            // Count unique voters
            const uniqueVoters = [...new Set(votes.map(vote => vote.userId))];
            
            return {
                totalVotes: votes.length,
                uniqueVoters: uniqueVoters.length,
                totalEligibleVoters: voters.length,
                participationRate: voters.length > 0 ? (uniqueVoters.length / voters.length) * 100 : 0
            };
        } catch (error) {
            console.error('Error getting voting statistics:', error);
            throw error;
        }
    }
}

module.exports = new VotingController();