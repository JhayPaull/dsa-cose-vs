const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple in-memory storage for testing
const users = [];

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'tcc_evoting_secret_key';

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            role: user.role || 'user'
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
    );
}

// Register
router.post('/register', async (req, res) => {
    try {
        const { 
            lastName, 
            firstName, 
            middleInitial, 
            course, 
            year, 
            section, 
            studentId, 
            email, 
            password, 
            confirmPassword 
        } = req.body;

        // Validate input
        if (!lastName || !firstName || !course || !year || !section || 
            !studentId || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email || u.student_id === studentId);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or student ID' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user object
        const user = {
            id: users.length + 1,
            last_name: lastName,
            first_name: firstName,
            middle_initial: middleInitial || '',
            course: course,
            year: year,
            section: section,
            full_name: middleInitial 
                ? `${firstName} ${middleInitial} ${lastName}` 
                : `${firstName} ${lastName}`,
            student_id: studentId,
            email: email,
            password: hashedPassword,
            role: 'user',
            created_at: new Date(),
            updated_at: new Date()
        };

        // Add user to array
        users.push(user);

        return res.status(201).json({ 
            message: 'Registration successful',
            userId: user.id
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ 
            message: 'Server error during registration. Please try again later.'
        });
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
        const user = users.find(u => u.email === email || u.student_id === email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        return res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            message: 'Server error during login. Please try again later.'
        });
    }
});

module.exports = router;