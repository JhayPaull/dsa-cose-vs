// Notification Controller for Notification Operations
const DatabaseController = require('./DatabaseController');

class NotificationController {
    // Create a notification
    async createNotification(notificationData) {
        try {
            return await DatabaseController.createNotification(notificationData);
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Get notification by ID
    async getNotificationById(notificationId) {
        try {
            const notification = await DatabaseController.getNotificationById(notificationId);
            if (!notification) {
                throw new Error('Notification not found');
            }
            return notification;
        } catch (error) {
            console.error('Error getting notification by ID:', error);
            throw error;
        }
    }

    // Get notifications by recipient
    async getNotificationsByRecipient(recipientId) {
        try {
            return await DatabaseController.getNotificationsByRecipient(recipientId);
        } catch (error) {
            console.error('Error getting notifications by recipient:', error);
            throw error;
        }
    }

    // Get all notifications with optional filters
    async getAllNotifications(filters = {}) {
        try {
            return await DatabaseController.getAllDocuments('notifications', filters);
        } catch (error) {
            console.error('Error getting all notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            return await DatabaseController.markNotificationAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Mark all notifications as read for a user
    async markAllAsRead(recipientId) {
        try {
            const notifications = await this.getNotificationsByRecipient(recipientId);
            const updatedNotifications = [];
            
            for (const notification of notifications) {
                if (!notification.isRead) {
                    const updated = await DatabaseController.markNotificationAsRead(notification.id);
                    updatedNotifications.push(updated);
                }
            }
            
            return updatedNotifications;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Delete notification
    async deleteNotification(notificationId) {
        try {
            // Check if notification exists
            const notification = await DatabaseController.getNotificationById(notificationId);
            if (!notification) {
                throw new Error('Notification not found');
            }

            // Delete the notification
            return await DatabaseController.deleteDocument('notifications', notificationId);
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    // Get unread notifications count for a user
    async getUnreadCount(recipientId) {
        try {
            const notifications = await DatabaseController.getNotificationsByRecipient(recipientId);
            const unreadNotifications = notifications.filter(notification => !notification.isRead);
            return unreadNotifications.length;
        } catch (error) {
            console.error('Error getting unread notifications count:', error);
            throw error;
        }
    }

    // Create bulk notifications (e.g., broadcast to all users)
    async createBulkNotifications(notificationData, recipientIds) {
        try {
            const createdNotifications = [];
            
            for (const recipientId of recipientIds) {
                const notification = {
                    ...notificationData,
                    recipientId: recipientId
                };
                
                const created = await DatabaseController.createNotification(notification);
                createdNotifications.push(created);
            }
            
            return createdNotifications;
        } catch (error) {
            console.error('Error creating bulk notifications:', error);
            throw error;
        }
    }
}

module.exports = new NotificationController();