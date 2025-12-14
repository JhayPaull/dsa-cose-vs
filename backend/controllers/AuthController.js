// Auth Controller for Authentication Logic
const bcrypt = require('bcryptjs');
const { db, COLLECTIONS, toFirestoreTimestamp } = require('../config/database-firebase');
const { generateToken } = require('../middleware/auth');
const User = require('../models/User');

class AuthController {
    // Register a new user
    async register(userData) {
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
                fullName 
            } = userData;

            // Validate required input fields (middleInitial is now optional)
            if (!lastName || !firstName || !course || !year || !section || 
                !studentId || !email || !password) {
                throw new Error('All required fields must be filled');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Invalid email format');
            }

            // Validate student ID format (numeric only)
            if (!/^\d+$/.test(studentId)) {
                throw new Error('Student ID must contain only numbers');
            }

            // Validate password strength
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Check if user already exists
            const emailQuery = await db.collection(COLLECTIONS.USERS).where('email', '==', email).get();
            if (!emailQuery.empty) {
                throw new Error('User already exists with this email');
            }
            
            // Check student ID uniqueness
            const studentIdQuery = await db.collection(COLLECTIONS.USERS).where('student_id', '==', studentId).get();
            if (!studentIdQuery.empty) {
                throw new Error('User already exists with this student ID');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user document with all new fields, default role is 'voter'
            const userDoc = {
                last_name: lastName,
                first_name: firstName,
                middle_initial: middleInitial || '', // Handle optional middle name/initial
                course: course,
                year: year,
                section: section,
                full_name: fullName || (middleInitial 
                    ? `${firstName} ${middleInitial.charAt(0).toUpperCase()} ${lastName}` 
                    : `${firstName} ${lastName}`), // Handle optional middle name/initial in full name
                student_id: studentId,
                email: email,
                password: hashedPassword,
                role: 'voter', // All users are voters by default
                created_at: toFirestoreTimestamp(new Date()),
                updated_at: toFirestoreTimestamp(new Date())
            };

            // Create the user
            const userRef = await db.collection(COLLECTIONS.USERS).add(userDoc);
            const userId = userRef.id;

            // Create welcome notification (non-critical)
            try {
                await db.collection(COLLECTIONS.NOTIFICATIONS).add({
                    user_id: userId,
                    title: 'Welcome to TCC E-Voting System',
                    message: 'Your account has been successfully created. You can now participate in the election.',
                    type: 'success',
                    read: false,
                    created_at: toFirestoreTimestamp(new Date())
                });
            } catch (notificationError) {
                console.error('Non-critical error creating notification:', notificationError);
                // Continue even if notification fails
            }

            return { 
                message: 'Registration successful',
                userId: userId
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Create admin account
    async createAdmin(adminData) {
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
                password
            } = adminData;

            // Validate input
            if (!lastName || !firstName || !course || !year || !section || 
                !studentId || !email || !password) {
                throw new Error('All fields are required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Invalid email format');
            }

            // Validate student ID format (numeric only)
            if (!/^\d+$/.test(studentId)) {
                throw new Error('Student ID must contain only numbers');
            }

            // Validate password strength
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Check if user already exists
            const emailQuery = await db.collection(COLLECTIONS.USERS).where('email', '==', email).get();
            if (!emailQuery.empty) {
                throw new Error('User already exists with this email');
            }
            
            // Check student ID uniqueness
            const studentIdQuery = await db.collection(COLLECTIONS.USERS).where('student_id', '==', studentId).get();
            if (!studentIdQuery.empty) {
                throw new Error('User already exists with this student ID');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create admin user document
            const userDoc = {
                last_name: lastName,
                first_name: firstName,
                middle_initial: middleInitial || '',
                course: course,
                year: year,
                section: section,
                full_name: middleInitial 
                    ? `${firstName} ${middleInitial.charAt(0).toUpperCase()} ${lastName}` 
                    : `${firstName} ${lastName}`,
                student_id: studentId,
                email: email,
                password: hashedPassword,
                role: 'admin', // Force role to admin for this endpoint
                created_at: toFirestoreTimestamp(new Date()),
                updated_at: toFirestoreTimestamp(new Date())
            };

            // Create the admin user
            const userRef = await db.collection(COLLECTIONS.USERS).add(userDoc);
            const userId = userRef.id;

            // Create welcome notification (non-critical)
            try {
                await db.collection(COLLECTIONS.NOTIFICATIONS).add({
                    user_id: userId,
                    title: 'Welcome Admin!',
                    message: 'Your admin account has been successfully created.',
                    type: 'success',
                    read: false,
                    created_at: toFirestoreTimestamp(new Date())
                });
            } catch (notificationError) {
                console.error('Non-critical error creating admin notification:', notificationError);
                // Continue even if notification fails
            }

            return { 
                message: 'Admin account created successfully',
                userId: userId
            };
        } catch (error) {
            console.error('Admin creation error:', error);
            throw error;
        }
    }

    // User login
    async login(credentials) {
        try {
            const { email, password } = credentials;

            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Validate email format if it looks like an email
            if (email.includes('@')) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Invalid email format');
                }
            }

            // Find user by email or student ID
            let userDoc = null;
            let userId = null;

            if (email.includes('@')) {
                // Search by email
                const emailQuery = await db.collection(COLLECTIONS.USERS).where('email', '==', email).get();
                if (!emailQuery.empty) {
                    userDoc = emailQuery.docs[0];
                    userId = userDoc.id;
                }
            } else {
                // Search by student ID
                const studentIdQuery = await db.collection(COLLECTIONS.USERS).where('student_id', '==', email).get();
                if (!studentIdQuery.empty) {
                    userDoc = studentIdQuery.docs[0];
                    userId = userDoc.id;
                }
            }

            if (!userDoc) {
                // Delay response to prevent timing attacks
                await new Promise(resolve => setTimeout(resolve, 1000));
                throw new Error('Invalid credentials');
            }

            const user = { id: userId, ...userDoc.data() };

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                // Delay response to prevent timing attacks
                await new Promise(resolve => setTimeout(resolve, 1000));
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = generateToken(user);

            // Return user data (without password)
            const { password: _, ...userWithoutPassword } = user;

            return {
                message: 'Login successful',
                token,
                user: userWithoutPassword
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Get current user
    async getCurrentUser(userId) {
        try {
            const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();

            if (!userDoc.exists) {
                throw new Error('User not found');
            }

            const userData = userDoc.data();
            const { password, ...userWithoutPassword } = userData;

            return { 
                user: {
                    id: userDoc.id,
                    ...userWithoutPassword
                }
            };
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    }
}

module.exports = new AuthController();