const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get notifications
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { filter = 'all' } = req.query;
        const userId = req.user.id;

        let query = 'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL';
        const params = [userId];

        if (filter === 'unread') {
            query += ' AND read = FALSE';
        } else if (filter === 'read') {
            query += ' AND read = TRUE';
        }

        query += ' ORDER BY created_at DESC';

        const [notifications] = await pool.query(query, params);

        // Get unread count
        const [unreadCount] = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE (user_id = ? OR user_id IS NULL) AND read = FALSE',
            [userId]
        );

        res.json({
            notifications,
            unreadCount: unreadCount[0].count
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

        await pool.query(
            'UPDATE notifications SET read = TRUE WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
            [id, userId]
        );

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

        await pool.query(
            'UPDATE notifications SET read = TRUE WHERE (user_id = ? OR user_id IS NULL) AND read = FALSE',
            [userId]
        );

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

        await pool.query(
            'DELETE FROM notifications WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
            [id, userId]
        );

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

        await pool.query(
            'DELETE FROM notifications WHERE user_id = ?',
            [userId]
        );

        res.json({ message: 'All notifications cleared' });
    } catch (error) {
        console.error('Clear all error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

