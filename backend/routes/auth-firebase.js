const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const result = await AuthController.register(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(400).json({ 
            message: error.message || 'Server error during registration. Please try again later.'
        });
    }
});

// Special endpoint to create admin account
router.post('/create-admin', async (req, res) => {
    try {
        const result = await AuthController.createAdmin(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error('Admin creation error:', error);
        return res.status(400).json({ 
            message: error.message || 'Server error during admin creation. Please try again later.'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const result = await AuthController.login(req.body);
        return res.json(result);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(401).json({ 
            message: error.message || 'Invalid credentials'
        });
    }
});

// Validate token - new endpoint for checking if token is still valid
router.get('/validate', authenticateToken, async (req, res) => {
    try {
        // If we reach this point, the token is valid
        // We can also check if the user still exists in the database
        const result = await AuthController.getCurrentUser(req.user.id);
        if (result.user) {
            return res.status(200).json({ 
                message: 'Token is valid',
                user: result.user
            });
        } else {
            return res.status(404).json({ 
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(401).json({ 
            message: 'Invalid token'
        });
    }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const result = await AuthController.getCurrentUser(req.user.id);
        return res.json(result);
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(404).json({ 
            message: error.message || 'User not found'
        });
    }
});

module.exports = router;