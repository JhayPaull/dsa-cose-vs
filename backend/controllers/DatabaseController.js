// Database Controller for Firestore Operations
const { db, admin, COLLECTIONS } = require('../config/database-firebase');

// Import models
const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const Notification = require('../models/Notification');

class DatabaseController {
    // Generic method to create a document
    async createDocument(collectionName, data) {
        try {
            const docRef = await db.collection(collectionName).add(data);
            return { id: docRef.id, ...data };
        } catch (error) {
            throw new Error(`Error creating document in ${collectionName}: ${error.message}`);
        }
    }

    // Generic method to get a document by ID
    async getDocumentById(collectionName, id) {
        try {
            const doc = await db.collection(collectionName).doc(id).get();
            if (!doc.exists) {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw new Error(`Error getting document from ${collectionName}: ${error.message}`);
        }
    }

    // Generic method to update a document
    async updateDocument(collectionName, id, data) {
        try {
            await db.collection(collectionName).doc(id).update(data);
            return { id, ...data };
        } catch (error) {
            throw new Error(`Error updating document in ${collectionName}: ${error.message}`);
        }
    }

    // Generic method to delete a document
    async deleteDocument(collectionName, id) {
        try {
            await db.collection(collectionName).doc(id).delete();
            return { success: true, message: `Document ${id} deleted from ${collectionName}` };
        } catch (error) {
            throw new Error(`Error deleting document from ${collectionName}: ${error.message}`);
        }
    }

    // Generic method to get all documents with optional filters
    async getAllDocuments(collectionName, filters = {}) {
        try {
            let query = db.collection(collectionName);
            
            // Apply filters if provided
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined) {
                    query = query.where(key, '==', filters[key]);
                }
            });
            
            const snapshot = await query.get();
            const documents = [];
            snapshot.forEach(doc => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            
            return documents;
        } catch (error) {
            throw new Error(`Error getting documents from ${collectionName}: ${error.message}`);
        }
    }

    // User-specific methods
    async createUser(userData) {
        const user = new User(userData);
        const validation = user.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        return await this.createDocument(COLLECTIONS.USERS, user.toFirestore());
    }

    async getUserById(id) {
        return await this.getDocumentById(COLLECTIONS.USERS, id);
    }

    async getUserByEmail(email) {
        try {
            const snapshot = await db.collection(COLLECTIONS.USERS)
                .where('email', '==', email)
                .limit(1)
                .get();
            
            if (snapshot.empty) {
                return null;
            }
            
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw new Error(`Error getting user by email: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        const user = new User({ id, ...userData });
        const validation = user.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        return await this.updateDocument(COLLECTIONS.USERS, id, user.toFirestore());
    }

    async getAllUsers(filters = {}) {
        return await this.getAllDocuments(COLLECTIONS.USERS, filters);
    }

    // Election-specific methods
    async createElection(electionData) {
        const election = new Election(electionData);
        const validation = election.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        return await this.createDocument(COLLECTIONS.ELECTIONS, election.toFirestore());
    }

    async getElectionById(id) {
        return await this.getDocumentById(COLLECTIONS.ELECTIONS, id);
    }

    async updateElection(id, electionData) {
        const election = new Election({ id, ...electionData });
        const validation = election.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        return await this.updateDocument(COLLECTIONS.ELECTIONS, id, election.toFirestore());
    }

    async getAllElections(filters = {}) {
        return await this.getAllDocuments(COLLECTIONS.ELECTIONS, filters);
    }

    // Candidate-specific methods
    async createCandidate(candidateData) {
        const candidate = new Candidate(candidateData);
        const validation = candidate.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        return await this.createDocument(COLLECTIONS.CANDIDATES, candidate.toFirestore());
    }

    async getCandidateById(id) {
        return await this.getDocumentById(COLLECTIONS.CANDIDATES, id);
    }

    async getCandidatesByElection(electionId) {
        return await this.getAllDocuments(COLLECTIONS.CANDIDATES, { electionId });
    }

    async updateCandidate(id, candidateData) {
        const candidate = new Candidate({ id, ...candidateData });
        const validation = candidate.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        return await this.updateDocument(COLLECTIONS.CANDIDATES, id, candidate.toFirestore());
    }

    // Vote-specific methods
    async createVote(voteData) {
        const vote = new Vote(voteData);
        const validation = vote.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        // Check if user already voted for this position in this election
        const existingVotes = await this.getAllDocuments(COLLECTIONS.VOTES, {
            userId: vote.userId,
            electionId: vote.electionId,
            position: vote.position
        });
        
        if (existingVotes.length > 0) {
            throw new Error('User has already voted for this position in this election');
        }
        
        return await this.createDocument(COLLECTIONS.VOTES, vote.toFirestore());
    }

    async getVoteById(id) {
        return await this.getDocumentById(COLLECTIONS.VOTES, id);
    }

    async getVotesByElection(electionId) {
        return await this.getAllDocuments(COLLECTIONS.VOTES, { electionId });
    }

    // Notification-specific methods
    async createNotification(notificationData) {
        const notification = new Notification(notificationData);
        const validation = notification.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation error: ${validation.errors.join(', ')}`);
        }
        
        return await this.createDocument(COLLECTIONS.NOTIFICATIONS, notification.toFirestore());
    }

    async getNotificationById(id) {
        return await this.getDocumentById(COLLECTIONS.NOTIFICATIONS, id);
    }

    async getNotificationsByRecipient(recipientId) {
        return await this.getAllDocuments(COLLECTIONS.NOTIFICATIONS, { recipientId });
    }

    async markNotificationAsRead(id) {
        return await this.updateDocument(COLLECTIONS.NOTIFICATIONS, id, {
            isRead: true,
            readAt: new Date()
        });
    }

    // Analytics methods
    async getVoteCountsByElection(electionId) {
        try {
            const votes = await this.getVotesByElection(electionId);
            const voteCounts = {};
            
            votes.forEach(vote => {
                const candidateId = vote.candidateId;
                if (!voteCounts[candidateId]) {
                    voteCounts[candidateId] = 0;
                }
                voteCounts[candidateId]++;
            });
            
            return voteCounts;
        } catch (error) {
            throw new Error(`Error getting vote counts: ${error.message}`);
        }
    }

    async getTotalVotesByElection(electionId) {
        try {
            const votes = await this.getVotesByElection(electionId);
            return votes.length;
        } catch (error) {
            throw new Error(`Error getting total votes: ${error.message}`);
        }
    }
}

module.exports = new DatabaseController();