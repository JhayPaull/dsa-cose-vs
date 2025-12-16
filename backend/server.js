const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for Express app
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:8000',
            'http://127.0.0.1:8000',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://0.0.0.0:8080',
            'http://frontend:8080',  // Docker service name
            'https://dsa-cose-vs.web.app',
            'https://dsa-cose-vs.firebaseapp.com'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Configure Socket.IO with error handling
const io = socketIo(server, {
    cors: corsOptions
});

// Global rate limiter for all routes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply global rate limiting
app.use(globalLimiter);

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increase payload limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - from ${req.ip}`);
    next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Firebase
let useFirebase = true; // Enable Firebase by default
let firebaseInitialized = false;
try {
    // Try to initialize Firebase
    const { initializeDatabase } = require('./config/database-firebase');
    initializeDatabase();
    console.log('Firebase initialized successfully');
    useFirebase = true;
    firebaseInitialized = true;
} catch (error) {
    console.error('Firebase initialization failed:', error.message);
    console.log('Falling back to local storage');
    useFirebase = false;
    firebaseInitialized = false;
}

// Import routes (only Firebase versions now)
const authRoutes = require('./routes/auth-firebase');
const dashboardRoutes = require('./routes/dashboard-firebase');
const analyticsRoutes = require('./routes/analytics-firebase');
const notificationRoutes = require('./routes/notifications-firebase');
const votingRoutes = require('./routes/voting-firebase');
const adminRoutes = require('./routes/admin-firebase'); // Add admin routes
const sliderRoutes = require('./routes/slider'); // Add slider routes

console.log('Using Firebase routes for all endpoints');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/admin', adminRoutes); // Add admin routes
app.use('/api/slider', sliderRoutes); // Add slider routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'TCC E-Voting API is running',
        database: useFirebase ? 'Firebase' : 'Local',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend routes (must be after all API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler for JSON responses
app.use((err, req, res, next) => {
    // Log the error for debugging
    console.error('Unhandled error:', err);
    
    // Return JSON error response
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Real-time vote updates via Socket.IO
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('subscribe-votes', () => {
        socket.join('vote-updates');
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io available to routes
app.set('io', io);

// Get port from environment or use default
const PORT = process.env.PORT || 3001;

// Handle server startup with port fallback (limit retries)
let retryCount = 0;
const maxRetries = 3; // Limit retries to prevent infinite loops
let serverStarted = false;

function startServer(port) {
    if (serverStarted) return;
    
    // Bind to 0.0.0.0 to allow connections from outside the container
    server.listen(port, '0.0.0.0', () => {
        serverStarted = true;
        console.log(`Server running on port ${port}`);
        console.log(`Database backend: Firebase`);
        console.log(`CORS enabled for origins: http://localhost:8000, http://localhost:8080, http://localhost:3000, http://localhost:3001, https://dsa-cose-vs.web.app, https://dsa-cose-vs.firebaseapp.com`);
        console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            retryCount++;
            if (retryCount <= maxRetries) {
                const newPort = port + (retryCount * 10);
                console.log(`Port ${port} is busy, trying ${newPort}`);
                setTimeout(() => startServer(newPort), 1000);
            } else {
                console.error(`Unable to start server after ${maxRetries} attempts. Please free up port ${port} or specify a different port.`);
                process.exit(1);
            }
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

startServer(PORT);