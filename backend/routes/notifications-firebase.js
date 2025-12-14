const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const NotificationController = require('../controllers/NotificationController');
const DatabaseController = require('../controllers/DatabaseController');

const router = express.Router();

// Get notifications
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { filter = 'all' } = req.query;
        const userId = req.user.id;

        // Get user notifications
        const userNotifications = await NotificationController.getNotificationsByRecipient(userId);
        
        // Get global notifications
        const globalNotifications = await DatabaseController.getAllDocuments('notifications', { userId: null });
        
        let allNotifications = [...userNotifications, ...globalNotifications];
        
        // Apply filter
        if (filter === 'unread') {
            allNotifications = allNotifications.filter(notification => notification.isRead === false);
        } else if (filter === 'read') {
            allNotifications = allNotifications.filter(notification => notification.isRead === true);
        }
        
        // Sort by createdAt descending
        allNotifications.sort((a, b) => {
            const aTime = new Date(a.createdAt);
            const bTime = new Date(b.createdAt);
            return bTime - aTime;
        });
        
        const notifications = allNotifications.slice(0, 50).map(notification => ({
            id: notification.id,
            ...notification,
            createdAt: new Date(notification.createdAt)
        }));
        
        // Get unread count
        const unreadUserNotifications = userNotifications.filter(notification => notification.isRead === false);
        const unreadGlobalNotifications = globalNotifications.filter(notification => notification.isRead === false);
        
        res.json({
            notifications,
            unreadCount: unreadUserNotifications.length + unreadGlobalNotifications.length
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await NotificationController.getNotificationById(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId && notification.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await NotificationController.markAsRead(id);

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark all as read
router.put('/read-all', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Mark user notifications as read
        await NotificationController.markAllAsRead(userId);
        
        // Get global notifications and mark them as read
        const globalNotifications = await DatabaseController.getAllDocuments('notifications', { 
            userId: null, 
            isRead: false 
        });
        
        for (const notification of globalNotifications) {
            await NotificationController.markAsRead(notification.id);
        }

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete notification
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await NotificationController.getNotificationById(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId && notification.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await NotificationController.deleteNotification(id);

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Clear all notifications
router.delete('/clear-all', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all user notifications
        const userNotifications = await NotificationController.getNotificationsByRecipient(userId);

        // Delete each notification
        for (const notification of userNotifications) {
            await NotificationController.deleteNotification(notification.id);
        }

        res.json({ message: 'All notifications cleared' });
    } catch (error) {
        console.error('Clear all error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
