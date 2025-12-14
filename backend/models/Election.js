// Election Model Schema for Firestore
class Election {
    constructor(data) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.startDate = data.startDate || null;
        this.endDate = data.endDate || null;
        this.status = data.status || 'draft'; // draft, active, completed, cancelled
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.createdBy = data.createdBy || null; // admin user ID
        this.votingStartTime = data.votingStartTime || null;
        this.votingEndTime = data.votingEndTime || null;
        this.isPublic = data.isPublic !== undefined ? data.isPublic : false;
    }

    // Convert to Firestore document data
    toFirestore() {
        return {
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            createdBy: this.createdBy,
            votingStartTime: this.votingStartTime,
            votingEndTime: this.votingEndTime,
            isPublic: this.isPublic
        };
    }

    // Validate election data
    validate() {
        const errors = [];
        
        if (!this.title) errors.push('Title is required');
        if (!this.startDate) errors.push('Start date is required');
        if (!this.endDate) errors.push('End date is required');
        if (!this.createdBy) errors.push('Created by user ID is required');
        
        // Validate dates
        if (this.startDate && this.endDate && this.startDate > this.endDate) {
            errors.push('Start date must be before end date');
        }
        
        // Validate status
        const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
        if (!validStatuses.includes(this.status)) {
            errors.push('Invalid status');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = Election;