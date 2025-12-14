// Admin Controller for Admin Operations
const DatabaseController = require('./DatabaseController');
const UserController = require('./UserController');
const ElectionController = require('./ElectionController');
const NotificationController = require('./NotificationController');

class AdminController {
    // Get system statistics
    async getSystemStatistics() {
        try {
            // Get user statistics
            const userStats = await UserController.getVoteStatistics();
            
            // Get all elections
            const elections = await ElectionController.getAllElections();
            
            // Get all notifications
            const notifications = await NotificationController.getAllNotifications();
            
            // Get recent activity (last 24 hours)
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentVotes = await DatabaseController.getAllDocuments('votes', {
                timestamp: '>=', value: twentyFourHoursAgo
            });
            
            return {
                users: userStats,
                elections: {
                    total: elections.length,
                    active: elections.filter(e => e.status === 'active').length,
                    completed: elections.filter(e => e.status === 'completed').length,
                    draft: elections.filter(e => e.status === 'draft').length
                },
                notifications: {
                    total: notifications.length,
                    unread: notifications.filter(n => !n.isRead).length
                },
                recentActivity: {
                    votes: recentVotes.length
                }
            };
        } catch (error) {
            console.error('Error getting system statistics:', error);
            throw error;
        }
    }

    // Create candidate
    async createCandidate(candidateData) {
        try {
            return await DatabaseController.createCandidate(candidateData);
        } catch (error) {
            console.error('Error creating candidate:', error);
            throw error;
        }
    }

    // Get candidate by ID
    async getCandidateById(candidateId) {
        try {
            const candidate = await DatabaseController.getDocumentById('candidates', candidateId);
            if (!candidate) {
                throw new Error('Candidate not found');
            }
            return candidate;
        } catch (error) {
            console.error('Error getting candidate by ID:', error);
            throw error;
        }
    }

    // Get all candidates with optional filters
    async getAllCandidates(filters = {}) {
        try {
            return await DatabaseController.getAllDocuments('candidates', filters);
        } catch (error) {
            console.error('Error getting all candidates:', error);
            throw error;
        }
    }

    // Update candidate
    async updateCandidate(candidateId, candidateData) {
        try {
            // First get the existing candidate to preserve important fields
            const existingCandidate = await DatabaseController.getDocumentById('candidates', candidateId);
            if (!existingCandidate) {
                throw new Error('Candidate not found');
            }

            // Merge the existing candidate data with the new data
            const mergedData = { ...existingCandidate, ...candidateData, updatedAt: new Date() };
            
            return await DatabaseController.updateDocument('candidates', candidateId, mergedData);
        } catch (error) {
            console.error('Error updating candidate:', error);
            throw error;
        }
    }

    // Delete candidate
    async deleteCandidate(candidateId) {
        try {
            // Check if candidate exists
            const candidate = await DatabaseController.getDocumentById('candidates', candidateId);
            if (!candidate) {
                throw new Error('Candidate not found');
            }

            // Delete the candidate
            return await DatabaseController.deleteDocument('candidates', candidateId);
        } catch (error) {
            console.error('Error deleting candidate:', error);
            throw error;
        }
    }

    // Broadcast notification to all users
    async broadcastNotification(notificationData) {
        try {
            // Get all users
            const users = await DatabaseController.getAllUsers();
            const userIds = users.map(user => user.id);
            
            // Create bulk notifications
            return await NotificationController.createBulkNotifications(notificationData, userIds);
        } catch (error) {
            console.error('Error broadcasting notification:', error);
            throw error;
        }
    }

    // Get audit logs (simplified version)
    async getAuditLogs(limit = 50) {
        try {
            // In a real system, you would have a dedicated audit log collection
            // For now, we'll simulate with recent notifications and votes
            const notifications = await NotificationController.getAllNotifications();
            const votes = await DatabaseController.getAllDocuments('votes');
            
            // Combine and sort by timestamp
            const logs = [
                ...notifications.map(n => ({
                    id: n.id,
                    type: 'notification',
                    action: 'created',
                    timestamp: n.createdAt,
                    data: { title: n.title, recipientId: n.recipientId }
                })),
                ...votes.map(v => ({
                    id: v.id,
                    type: 'vote',
                    action: 'cast',
                    timestamp: v.timestamp,
                    data: { userId: v.userId, electionId: v.electionId, candidateId: v.candidateId }
                }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
            
            return logs;
        } catch (error) {
            console.error('Error getting audit logs:', error);
            throw error;
        }
    }
}

module.exports = new AdminController();