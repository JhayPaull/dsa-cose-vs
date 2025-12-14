// Shared API Configuration
// This file provides a consistent API_BASE_URL across all frontend JavaScript files

(function() {
    // API Base URL - dynamically determine based on environment
    window.API_BASE_URL = (function() {
        // Check if we have a configured backend URL in localStorage (for production)
        const configuredBackendUrl = localStorage.getItem('backend_url');
        if (configuredBackendUrl) {
            return configuredBackendUrl.endsWith('/api') ? configuredBackendUrl : `${configuredBackendUrl}/api`;
        }
        
        // Check if running in Docker container (via environment variable)
        if (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) {
            console.log('Using API_BASE_URL from environment variable:', process.env.API_BASE_URL);
            return process.env.API_BASE_URL;
        }
        
        // Check if we're in a browser environment with specific hostnames
        if (window.location.hostname === 'dsa-cose-vs.web.app' || 
            window.location.hostname === 'dsa-cose-vs.firebaseapp.com') {
            // For production Firebase Hosting
            // Use localhost as default for Firebase hosting since we're not using Google Cloud
            console.log('Using default Firebase hosting URL');
            return 'http://localhost:3001/api';
        } else if (window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname === '0.0.0.0') {
            // For local development
            // Check if we're in Docker environment
            if (window.location.port === '8081') {
                // Docker environment - use the Docker network service name
                console.log('Using Docker container URL: http://backend:3001/api');
                return 'http://backend:3001/api';
            } else {
                // Local development - backend is on localhost
                console.log('Using localhost development URL');
                return 'http://localhost:3001/api';
            }
        } else {
            // Default fallback for other environments
            console.log('Using default fallback URL');
            return 'http://localhost:3001/api';
        }
    })();
    
    console.log('API Base URL configured:', window.API_BASE_URL);
    console.log('Hostname:', window.location.hostname);
    console.log('Port:', window.location.port);
})();