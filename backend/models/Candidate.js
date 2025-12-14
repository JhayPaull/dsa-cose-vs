// Candidate Model Schema for Firestore
class Candidate {
    constructor(data) {
        this.id = data.id || null;
        this.userId = data.userId || null; // Reference to User document
        this.electionId = data.electionId || null; // Reference to Election document
        this.position = data.position || ''; // e.g., President, Vice President, Secretary
        this.platform = data.platform || ''; // Campaign platform/promise
        this.party = data.party || ''; // Political party (if applicable)
        this.voteCount = data.voteCount || 0;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    // Convert to Firestore document data
    toFirestore() {
        return {
            userId: this.userId,
            electionId: this.electionId,
            position: this.position,
            platform: this.platform,
            party: this.party,
            voteCount: this.voteCount,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Validate candidate data
    validate() {
        const errors = [];
        
        if (!this.userId) errors.push('User ID is required');
        if (!this.electionId) errors.push('Election ID is required');
        if (!this.position) errors.push('Position is required');
        
        // Ensure vote count is not negative
        if (this.voteCount < 0) {
            errors.push('Vote count cannot be negative');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = Candidate;