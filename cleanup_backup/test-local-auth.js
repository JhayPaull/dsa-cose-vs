// Test script for local authentication routes
const express = require('express');
const authRoutes = require('./backend/routes/auth-local');

const app = express();
const port = 3002;

// Middleware
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
    console.log('Available endpoints:');
    console.log('POST /api/auth/create-admin');
    console.log('POST /api/auth/login');
    console.log('GET /api/auth/me');
});