// User Model Schema for Firestore
class User {
    constructor(data) {
        this.id = data.id || null;
        this.email = data.email || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.middleInitial = data.middleInitial || '';
        this.studentId = data.studentId || '';
        this.role = data.role || 'voter'; // voter, admin, candidate
        this.gradeLevel = data.gradeLevel || '';
        this.section = data.section || '';
        this.hasVoted = data.hasVoted || false;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.lastLogin = data.lastLogin || null;
        this.isActive = data.isActive !== undefined ? data.isActive : true;
    }

    // Convert to Firestore document data
    toFirestore() {
        return {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            middleInitial: this.middleInitial,
            studentId: this.studentId,
            role: this.role,
            gradeLevel: this.gradeLevel,
            section: this.section,
            hasVoted: this.hasVoted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            lastLogin: this.lastLogin,
            isActive: this.isActive
        };
    }

    // Validate user data
    validate() {
        const errors = [];
        
        if (!this.email) errors.push('Email is required');
        if (!this.firstName) errors.push('First name is required');
        if (!this.lastName) errors.push('Last name is required');
        if (!this.studentId) errors.push('Student ID is required');
        if (!this.gradeLevel) errors.push('Grade level is required');
        if (!this.section) errors.push('Section is required');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.email && !emailRegex.test(this.email)) {
            errors.push('Invalid email format');
        }
        
        // Validate role
        const validRoles = ['voter', 'candidate', 'admin'];
        if (!validRoles.includes(this.role)) {
            errors.push('Invalid role');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = User;