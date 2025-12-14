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
    
    // Show role-specific dashboard
    showDashboardForRole(user.role);
    
    // Load dashboard data
    loadDashboardData(user.role);
    
    // Set up event listeners
    setupEventListeners();
});

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
        console.log('Showing admin dashboard');
    } else {
        // Show student dashboard
        studentDashboard.style.display = 'block';
        adminDashboard.style.display = 'none';
        console.log('Showing student dashboard');
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

function loadStudentDashboardData() {
    console.log('Loading student dashboard data...');
    // Add your student dashboard data loading logic here
    // For example:
    // fetchStudentData();
    // loadElections();
    // updateNotifications();
    
    // Sample data for demonstration
    document.getElementById('totalVoters').textContent = '1,248';
    document.getElementById('votesCast').textContent = '892';
    document.getElementById('turnoutRate').textContent = '71.5%';
    document.getElementById('timeRemaining').textContent = '2d 4h 32m';
}

function loadAdminDashboardData() {
    console.log('Loading admin dashboard data...');
    // Add your admin dashboard data loading logic here
    // For example:
    // fetchAdminStats();
    // loadAdminActivity();
    // updateAdminNotifications();
    
    // Sample data for demonstration
    document.getElementById('adminTotalUsers').textContent = '1,248';
    document.getElementById('adminTotalSubAdmins').textContent = '12';
    document.getElementById('adminTotalVotes').textContent = '892';
    document.getElementById('adminPendingNotifications').textContent = '5';
}

function setupEventListeners() {
    // Add any dashboard-specific event listeners here
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login
            window.location.href = '/auth/login/';
        });
    }
    
    // Add navigation event listeners
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Handle navigation without full page reload if using SPA
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
}

// Add any additional dashboard-specific functions below