// Dashboard-specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard script loaded');
    
    // Check authentication status
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // If no token, redirect to login
    if (!token) {
        console.log('No authentication token found, redirecting to login');
        window.location.href = '/auth/login/';
        return;
    }
    
    // Initialize Firebase if available
    initializeFirebase();
    
    // Show role-specific dashboard
    showDashboardForRole(user.role);
    
    // Load dashboard data
    loadDashboardData(user.role);
    
    // Set up event listeners
    setupEventListeners();
});

function initializeFirebase() {
    // Check if Firebase is already initialized
    if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
        try {
            // Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyDMc7Jjalkz8ymZkLfcbjMAtZgUpYC2xeU",
                authDomain: "dsa-cose-vs.firebaseapp.com",
                projectId: "dsa-cose-vs",
                storageBucket: "dsa-cose-vs.firebasestorage.app",
                messagingSenderId: "249427875322",
                appId: "1:249427875322:web:e2a8c1a78cd1157f2f8043",
                measurementId: "G-R9WJ2VM2ZT"
            };

            // Initialize Firebase
            const app = firebase.initializeApp(firebaseConfig);
            const auth = firebase.auth();
            const db = firebase.firestore();
            
            // Make Firebase services available globally
            window.firebaseApp = app;
            window.firebaseAuth = auth;
            window.firebaseDb = db;
            
            console.log('Firebase initialized successfully for DSA-COSE-VS');
        } catch (error) {
            console.error('Error initializing Firebase:', error);
        }
    } else if (firebase && firebase.apps.length > 0) {
        // Firebase is already initialized
        window.firebaseApp = firebase.app();
        window.firebaseAuth = firebase.auth();
        window.firebaseDb = firebase.firestore();
        console.log('Firebase already initialized');
    }
}

function showDashboardForRole(role) {
    const studentDashboard = document.getElementById('student-dashboard');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    if (!studentDashboard || !adminDashboard) {
        console.error('Dashboard elements not found');
        return;
    }
    
    if (role === 'admin' || role === 'sub-admin') {
        // Show admin dashboard
        studentDashboard.style.display = 'none';
        adminDashboard.style.display = 'block';
        console.log('Showing admin dashboard for role:', role);
    } else {
        // Show student dashboard
        studentDashboard.style.display = 'block';
        adminDashboard.style.display = 'none';
        console.log('Showing student dashboard for role:', role);
    }
}

function loadDashboardData(role) {
    console.log('Loading dashboard data for role:', role);
    
    if (role === 'admin' || role === 'sub-admin') {
        // Load admin-specific data
        loadAdminDashboardData();
    } else {
        // Load student-specific data
        loadStudentDashboardData();
    }
}

async function loadStudentDashboardData() {
    console.log('Loading student dashboard data...');
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
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
            document.getElementById('totalVoters').textContent = stats.totalVoters || '0';
            document.getElementById('votesCast').textContent = stats.votesCast || '0';
            document.getElementById('turnoutRate').textContent = `${stats.turnoutRate || 0}%`;
            document.getElementById('timeRemaining').textContent = stats.timeRemaining || '--:--';
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
            renderStudentActivity(activity.recentActivity || []);
        }
    } catch (error) {
        console.error('Error loading student dashboard data:', error);
        // Show sample data for demonstration
        document.getElementById('totalVoters').textContent = '1,248';
        document.getElementById('votesCast').textContent = '892';
        document.getElementById('turnoutRate').textContent = '71.5%';
        document.getElementById('timeRemaining').textContent = '2d 4h 32m';
    }
}

async function loadAdminDashboardData() {
    console.log('Loading admin dashboard data...');
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        // Load admin statistics
        const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            
            // Update UI
            document.getElementById('adminTotalUsers').textContent = stats.totalUsers || '0';
            document.getElementById('adminTotalSubAdmins').textContent = stats.totalSubAdmins || '0';
            document.getElementById('adminTotalVotes').textContent = stats.totalVotes || '0';
            document.getElementById('adminPendingNotifications').textContent = stats.pendingNotifications || '0';
        }
        
        // Load recent activity
        const activityResponse = await fetch(`${API_BASE_URL}/admin/activity`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (activityResponse.ok) {
            const activity = await activityResponse.json();
            renderAdminActivity(activity.recentActivity || []);
        }
    } catch (error) {
        console.error('Error loading admin dashboard data:', error);
        // Show sample data for demonstration
        document.getElementById('adminTotalUsers').textContent = '1,248';
        document.getElementById('adminTotalSubAdmins').textContent = '12';
        document.getElementById('adminTotalVotes').textContent = '892';
        document.getElementById('adminPendingNotifications').textContent = '5';
    }
}

function renderStudentActivity(activities) {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    if (activities.length === 0) {
        activityContainer.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }
    
    activityContainer.innerHTML = activities.map(activity => `
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

function renderAdminActivity(activities) {
    const activityContainer = document.getElementById('adminRecentActivity');
    if (!activityContainer) return;
    
    if (activities.length === 0) {
        activityContainer.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }
    
    activityContainer.innerHTML = activities.map(activity => `
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

function setupEventListeners() {
    // Add any dashboard-specific event listeners here
    
    // Handle settings link
    const settingsLink = document.getElementById('settingsLink');
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Settings functionality would be implemented here');
        });
    }
}

// Enhanced logout function with Firebase signout
function logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Sign out from Firebase if available
    if (window.firebaseAuth && typeof window.firebaseAuth.signOut === 'function') {
        window.firebaseAuth.signOut()
            .then(() => {
                console.log('Firebase sign out successful');
                // Redirect to login
                window.location.href = '/auth/login/';
            })
            .catch((error) => {
                console.error('Firebase sign out error:', error);
                // Even if Firebase sign out fails, redirect to login
                window.location.href = '/auth/login/';
            });
    } else {
        // Redirect to login page
        window.location.href = '/auth/login/';
    }
}

// Add any additional dashboard-specific functions below