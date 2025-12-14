// Election Controller for Election Management Operations
const DatabaseController = require('./DatabaseController');

class ElectionController {
    // Create a new election
    async createElection(electionData) {
        try {
            return await DatabaseController.createElection(electionData);
        } catch (error) {
            console.error('Error creating election:', error);
            throw error;
        }
    }

    // Get election by ID
    async getElectionById(electionId) {
        try {
            const election = await DatabaseController.getElectionById(electionId);
            if (!election) {
                throw new Error('Election not found');
            }
            return election;
        } catch (error) {
            console.error('Error getting election by ID:', error);
            throw error;
        }
    }

    // Get all elections with optional filters
    async getAllElections(filters = {}) {
        try {
            return await DatabaseController.getAllElections(filters);
        } catch (error) {
            console.error('Error getting all elections:', error);
            throw error;
        }
    }

    // Update election
    async updateElection(electionId, electionData) {
        try {
            // First get the existing election to preserve important fields
            const existingElection = await DatabaseController.getElectionById(electionId);
            if (!existingElection) {
                throw new Error('Election not found');
            }

            // Merge the existing election data with the new data
            const mergedData = { ...existingElection, ...electionData, updatedAt: new Date() };
            
            return await DatabaseController.updateElection(electionId, mergedData);
        } catch (error) {
            console.error('Error updating election:', error);
            throw error;
        }
    }

    // Delete election
    async deleteElection(electionId) {
        try {
            // Check if election exists
            const election = await DatabaseController.getElectionById(electionId);
            if (!election) {
                throw new Error('Election not found');
            }

            // Delete the election
            return await DatabaseController.deleteDocument('elections', electionId);
        } catch (error) {
            console.error('Error deleting election:', error);
            throw error;
        }
    }

    // Get active elections
    async getActiveElections() {
        try {
            const now = new Date();
            return await DatabaseController.getAllElections({
                status: 'active'
            });
        } catch (error) {
            console.error('Error getting active elections:', error);
            throw error;
        }
    }

    // Get upcoming elections
    async getUpcomingElections() {
        try {
            const now = new Date();
            return await DatabaseController.getAllElections({
                status: 'draft'
            });
        } catch (error) {
            console.error('Error getting upcoming elections:', error);
            throw error;
        }
    }

    // Get completed elections
    async getCompletedElections() {
        try {
            return await DatabaseController.getAllElections({
                status: 'completed'
            });
        } catch (error) {
            console.error('Error getting completed elections:', error);
            throw error;
        }
    }

    // Set election status
    async setElectionStatus(electionId, status) {
        try {
            // Validate status
            const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid status');
            }

            // Update election status
            return await DatabaseController.updateElection(electionId, { status });
        } catch (error) {
            console.error('Error setting election status:', error);
            throw error;
        }
    }

    // Get election candidates
    async getElectionCandidates(electionId) {
        try {
            return await DatabaseController.getCandidatesByElection(electionId);
        } catch (error) {
            console.error('Error getting election candidates:', error);
            throw error;
        }
    }

    // Get election votes
    async getElectionVotes(electionId) {
        try {
            return await DatabaseController.getVotesByElection(electionId);
        } catch (error) {
            console.error('Error getting election votes:', error);
            throw error;
        }
    }

    // Get election results
    async getElectionResults(electionId) {
        try {
            // Get the election
            const election = await this.getElectionById(electionId);
            
            // Get candidates for this election
            const candidates = await this.getElectionCandidates(electionId);
            
            // Get votes for this election
            const votes = await this.getElectionVotes(electionId);
            
            // Calculate vote counts for each candidate
            const results = {};
            candidates.forEach(candidate => {
                results[candidate.id] = {
                    candidate: candidate,
                    voteCount: 0
                };
            });
            
            // Count votes for each candidate
            votes.forEach(vote => {
                if (results[vote.candidateId]) {
                    results[vote.candidateId].voteCount++;
                }
            });
            
            // Sort results by vote count (descending)
            const sortedResults = Object.values(results).sort((a, b) => b.voteCount - a.voteCount);
            
            return {
                election: election,
                results: sortedResults,
                totalVotes: votes.length
            };
        } catch (error) {
            console.error('Error getting election results:', error);
            throw error;
        }
    }
}

module.exports = new ElectionController();