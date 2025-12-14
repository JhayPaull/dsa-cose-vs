// Vote Model Schema for Firestore
class Vote {
    constructor(data) {
        this.id = data.id || null;
        this.userId = data.userId || null; // Reference to User document
        this.electionId = data.electionId || null; // Reference to Election document
        this.candidateId = data.candidateId || null; // Reference to Candidate document
        this.position = data.position || ''; // Position voted for
        this.timestamp = data.timestamp || new Date();
        this.isVerified = data.isVerified !== undefined ? data.isVerified : false;
    }

    // Convert to Firestore document data
    toFirestore() {
        return {
            userId: this.userId,
            electionId: this.electionId,
            candidateId: this.candidateId,
            position: this.position,
            timestamp: this.timestamp,
            isVerified: this.isVerified
        };
    }

    // Validate vote data
    validate() {
        const errors = [];
        
        if (!this.userId) errors.push('User ID is required');
        if (!this.electionId) errors.push('Election ID is required');
        if (!this.candidateId) errors.push('Candidate ID is required');
        if (!this.position) errors.push('Position is required');
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = Vote;