const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const AdminController = require('../controllers/AdminController');
const UserController = require('../controllers/UserController');
const DatabaseController = require('../controllers/DatabaseController');

const router = express.Router();

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}

// Middleware to check if user is admin or sub-admin
function isAdminOrSubAdmin(req, res, next) {
    if (req.user.role !== 'admin' && req.user.role !== 'sub-admin') {
        return res.status(403).json({ message: 'Access denied. Admins and sub-admins only.' });
    }
    next();
}

// Create sub-admin (admin only)
router.post('/create-sub-admin', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { 
            lastName, 
            firstName, 
            middleInitial, 
            year, 
            section, 
            department, 
            studentId, 
            email, 
            password
        } = req.body;

        // Validate input
        if (!lastName || !firstName || !year || !section || 
            !department || !studentId || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists by email
        try {
            const existingUser = await DatabaseController.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists with this email' });
            }
            
            // Check if user already exists by student ID
            const users = await DatabaseController.getAllUsers({ student_id: studentId });
            if (users.length > 0) {
                return res.status(400).json({ message: 'User already exists with this student ID' });
            }
        } catch (queryError) {
            console.error('Query error during sub-admin creation:', queryError);
            // Continue with sub-admin creation even if we can't verify existence
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create sub-admin user document
        const userData = {
            last_name: lastName,
            first_name: firstName,
            middle_initial: middleInitial || '',
            year: year,
            section: section,
            department: department,
            full_name: middleInitial 
                ? `${firstName} ${middleInitial} ${lastName}` 
                : `${firstName} ${lastName}`,
            student_id: studentId,
            email: email,
            password: hashedPassword,
            role: 'sub-admin', // Role is sub-admin
            created_by: req.user.id, // Track who created this sub-admin
            created_at: new Date(),
            updated_at: new Date()
        };

        // Create the sub-admin user
        const createdUser = await DatabaseController.createUser(userData);
        const userId = createdUser.id;

        // Create welcome notification
        try {
            await DatabaseController.createNotification({
                userId: userId,
                title: 'Welcome Sub-Admin!',
                message: 'Your sub-admin account has been successfully created by the system administrator.',
                type: 'success',
                isRead: false,
                createdAt: new Date()
            });
        } catch (notificationError) {
            console.error('Non-critical error creating sub-admin notification:', notificationError);
            // Continue even if notification fails
        }

        return res.status(201).json({ 
            message: 'Sub-admin account created successfully',
            userId: userId
        });
    } catch (error) {
        console.error('Sub-admin creation error:', error);
        return res.status(500).json({ 
            message: 'Server error during sub-admin creation. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all registered users (admin and sub-admin only)
router.get('/users', authenticateToken, isAdminOrSubAdmin, async (req, res) => {
    try {
        // Get all users
        const users = await UserController.getAllUsers();
        
        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return res.json({ 
            message: 'Users retrieved successfully',
            users: usersWithoutPasswords
        });
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ 
            message: 'Server error retrieving users. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all sub-admins (admin only)
router.get('/sub-admins', authenticateToken, isAdmin, async (req, res) => {
    try {
        // Get all sub-admin users
        const subAdmins = await UserController.getUsersByRole('sub-admin');
        
        // Remove passwords from response
        const subAdminsWithoutPasswords = subAdmins.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return res.json({ 
            message: 'Sub-admins retrieved successfully',
            subAdmins: subAdminsWithoutPasswords
        });
    } catch (error) {
        console.error('Get sub-admins error:', error);
        return res.status(500).json({ 
            message: 'Server error retrieving sub-admins. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete sub-admin (admin only)
router.delete('/sub-admin/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        // Check if user exists and is a sub-admin
        const user = await UserController.getUserById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'sub-admin') {
            return res.status(400).json({ message: 'User is not a sub-admin' });
        }

        // Delete the user
        await UserController.deleteUser(id);

        return res.json({ 
            message: 'Sub-admin deleted successfully'
        });
    } catch (error) {
        console.error('Delete sub-admin error:', error);
        return res.status(500).json({ 
            message: 'Server error deleting sub-admin. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;