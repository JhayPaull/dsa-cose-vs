const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { fullName, studentId, email, password, role } = req.body;

        // Validate input
        if (!fullName || !studentId || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR student_id = ?',
            [email, studentId]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email or student ID' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (full_name, student_id, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [fullName, studentId, email, hashedPassword, role]
        );

        // Create welcome notification
        await pool.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [result.insertId, 'Welcome to TCC E-Voting System', 'Your account has been successfully created. You can now participate in the election.', 'success']
        );

        res.status(201).json({ 
            message: 'Registration successful',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email or student ID
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR student_id = ?',
            [email, email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, full_name, student_id, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

