// Notification Model Schema for Firestore
class Notification {
    constructor(data) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.message = data.message || '';
        this.type = data.type || 'info'; // info, warning, success, error
        this.recipientId = data.recipientId || null; // Specific user ID or 'all' for broadcast
        this.isRead = data.isRead !== undefined ? data.isRead : false;
        this.createdAt = data.createdAt || new Date();
        this.readAt = data.readAt || null;
        this.senderId = data.senderId || null; // Admin who sent the notification
    }

    // Convert to Firestore document data
    toFirestore() {
        return {
            title: this.title,
            message: this.message,
            type: this.type,
            recipientId: this.recipientId,
            isRead: this.isRead,
            createdAt: this.createdAt,
            readAt: this.readAt,
            senderId: this.senderId
        };
    }

    // Validate notification data
    validate() {
        const errors = [];
        
        if (!this.title) errors.push('Title is required');
        if (!this.message) errors.push('Message is required');
        
        // Validate type
        const validTypes = ['info', 'warning', 'success', 'error'];
        if (!validTypes.includes(this.type)) {
            errors.push('Invalid notification type');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = Notification;