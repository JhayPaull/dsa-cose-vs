// Admin Dashboard JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// DOM Elements
const totalVotersEl = document.getElementById('totalVoters');
const votesCastEl = document.getElementById('votesCast');
const turnoutRateEl = document.getElementById('turnoutRate');
const timeRemainingEl = document.getElementById('timeRemaining');
const recentActivityEl = document.getElementById('recentActivity');

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Delay the authentication check slightly to ensure token is properly set
    setTimeout(() => {
        checkAuthentication();
    }, 100);
});

function checkAuthentication() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Admin dashboard auth check:', { token, user });
    
    // Check if user is logged in
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/auth/login/';
        return;
    }
    
    // Check user role - only admins and sub-admins should access this page
    if (user.role !== 'admin' && user.role !== 'sub-admin') {
        console.log('User role not authorized for admin dashboard, redirecting to voter dashboard');
        window.location.href = '/pages/dashboard/';
        return;
    }
    
    // Validate token with backend to ensure it's still valid
    validateTokenWithBackend(token)
        .then(isValid => {
            console.log('Token validation result:', isValid);
            if (!isValid) {
                console.log('Token invalid, redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login/';
                return;
            }
            
            // Only verify Firebase auth state if we have a real Firebase user AND a real Firebase token
            // Allow JWT tokens from backend login to work without Firebase auth
            // JWT tokens start with "ey", so we should NOT check Firebase auth for JWT tokens
            if (window.firebaseAuth && token && !token.startsWith('dummy-token') && !token.startsWith('ey')) {
                // This is a Firebase token, verify Firebase auth state
                window.firebaseAuth.onAuthStateChanged((firebaseUser) => {
                    if (!firebaseUser) {
                        // Clear token and redirect if Firebase auth is lost
                        console.log('Firebase auth lost, redirecting to login');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/auth/login/';
                        return;
                    }
                    // Refresh token if needed
                    firebaseUser.getIdToken().then((newToken) => {
                        localStorage.setItem('token', newToken);
                    });
                });
            }
            
            initializeDashboard();
        })
        .catch(error => {
            console.error('Token validation error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login/';
        });
}

// Validate token with backend
async function validateTokenWithBackend(token) {
    try {
        console.log('Validating token with backend at:', `${API_BASE_URL}/auth/validate`);
        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Token validation response:', response.status, response.statusText);
        return response.ok;
    } catch (error) {
        console.error('Token validation network error:', error);
        return false;
    }
}

function initializeDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update user info in header
    const userNameEl = document.getElementById('userName');
    
    if (userNameEl) {
        userNameEl.textContent = user.full_name || user.email || 'Admin';
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Set up notification panel
    setupNotificationPanel();
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        
        // Load election statistics
        const statsResponse = await fetch(`${API_BASE_URL}/election/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            
            // Update UI
            if (totalVotersEl) totalVotersEl.textContent = stats.totalVoters || 0;
            if (votesCastEl) votesCastEl.textContent = stats.votesCast || 0;
            if (turnoutRateEl) turnoutRateEl.textContent = `${stats.turnoutRate || 0}%`;
            if (timeRemainingEl) timeRemainingEl.textContent = stats.timeRemaining || '--:--';
        }
        
        // Load recent activity
        const activityResponse = await fetch(`${API_BASE_URL}/election/activity`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (activityResponse.ok) {
            const activity = await activityResponse.json();
            renderRecentActivity(activity.recentActivity || []);
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Render recent activity
function renderRecentActivity(activities) {
    if (!recentActivityEl) return;
    
    if (activities.length === 0) {
        recentActivityEl.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }
    
    recentActivityEl.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${activity.type === 'vote' ? 'vote-yea' : 'user'}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.description}</p>
                <small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
        </div>
    `).join('');
}

// Logout
function logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Sign out from Firebase if available
    if (window.firebaseAuth && window.firebaseAuth.signOut) {
        window.firebaseAuth.signOut().then(() => {
            // Redirect to login page
            window.location.href = '/auth/login/';
        }).catch((error) => {
            console.error('Firebase sign out error:', error);
            // Even if Firebase sign out fails, redirect to login
            window.location.href = '/auth/login/';
        });
    } else {
        // Redirect to login page
        window.location.href = '/auth/login/';
    }
}

// Set up notification panel
function setupNotificationPanel() {
    const notificationsIcon = document.getElementById('notificationsIcon');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', () => {
            notificationPanel.classList.add('active');
        });
    }
    
    if (closeNotifications) {
        closeNotifications.addEventListener('click', () => {
            notificationPanel.classList.remove('active');
        });
    }
    
    // Close panel when clicking outside
    if (notificationPanel) {
        notificationPanel.addEventListener('click', (e) => {
            if (e.target === notificationPanel) {
                notificationPanel.classList.remove('active');
            }
        });
    }
}