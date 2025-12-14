// User Controller for User Management Operations
const DatabaseController = require('./DatabaseController');

class UserController {
    // Get all users with optional filters
    async getAllUsers(filters = {}) {
        try {
            return await DatabaseController.getAllUsers(filters);
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const user = await DatabaseController.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        try {
            const user = await DatabaseController.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    }

    // Update user
    async updateUser(userId, userData) {
        try {
            // First get the existing user to preserve important fields
            const existingUser = await DatabaseController.getUserById(userId);
            if (!existingUser) {
                throw new Error('User not found');
            }

            // Merge the existing user data with the new data
            const mergedData = { ...existingUser, ...userData, updatedAt: new Date() };
            
            return await DatabaseController.updateUser(userId, mergedData);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Delete user
    async deleteUser(userId) {
        try {
            // Check if user exists
            const user = await DatabaseController.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Delete the user
            return await DatabaseController.deleteDocument('users', userId);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Set user role (admin only)
    async setUserRole(userId, role) {
        try {
            // Validate role
            const validRoles = ['voter', 'candidate', 'admin'];
            if (!validRoles.includes(role)) {
                throw new Error('Invalid role');
            }

            // Update user role
            return await DatabaseController.updateUser(userId, { role });
        } catch (error) {
            console.error('Error setting user role:', error);
            throw error;
        }
    }

    // Mark user as having voted
    async markUserAsVoted(userId) {
        try {
            return await DatabaseController.updateUser(userId, { hasVoted: true });
        } catch (error) {
            console.error('Error marking user as voted:', error);
            throw error;
        }
    }

    // Get users by role
    async getUsersByRole(role) {
        try {
            return await DatabaseController.getAllUsers({ role });
        } catch (error) {
            console.error('Error getting users by role:', error);
            throw error;
        }
    }

    // Get voters who haven't voted yet
    async getNonVoters() {
        try {
            return await DatabaseController.getAllUsers({ role: 'voter', hasVoted: false });
        } catch (error) {
            console.error('Error getting non-voters:', error);
            throw error;
        }
    }

    // Get vote statistics
    async getVoteStatistics() {
        try {
            const allUsers = await DatabaseController.getAllUsers();
            const voters = allUsers.filter(user => user.role === 'voter');
            const candidates = allUsers.filter(user => user.role === 'candidate');
            const admins = allUsers.filter(user => user.role === 'admin');
            
            const votedUsers = voters.filter(user => user.hasVoted);
            
            return {
                totalUsers: allUsers.length,
                totalVoters: voters.length,
                totalCandidates: candidates.length,
                totalAdmins: admins.length,
                votedUsers: votedUsers.length,
                nonVotedUsers: voters.length - votedUsers.length,
                votePercentage: voters.length > 0 ? (votedUsers.length / voters.length) * 100 : 0
            };
        } catch (error) {
            console.error('Error getting vote statistics:', error);
            throw error;
        }
    }
}

module.exports = new UserController();