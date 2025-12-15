// Admin Panel JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// DOM Elements
const createSubAdminForm = document.getElementById('createSubAdminForm');
const subAdminList = document.getElementById('subAdminList');
const userList = document.getElementById('userList');
const adminMessage = document.getElementById('adminMessage');
const totalUsersEl = document.getElementById('totalUsers');
const totalSubAdminsEl = document.getElementById('totalSubAdmins');
const totalVotesEl = document.getElementById('totalVotes');
const recentActivityEl = document.getElementById('recentActivity');

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Admin page auth check:', { token, user });
    
    // Redirect to login if no token
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/auth/login/';
        return;
    }
    
    // Check user role
    if (token.startsWith('dummy-token')) {
        console.log('Dummy token detected, allowing access');
    } else if (user.role === 'admin' || user.role === 'sub-admin') {
        console.log('Admin/Sub-admin access granted');
    } else {
        console.log('User role not authorized for admin panel, redirecting to dashboard');
        window.location.href = '/pages/dashboard/';
        return;
    }
    
    // Only verify Firebase auth state if we have a real Firebase user AND a real Firebase token
    // Allow JWT tokens from backend login to work without Firebase auth
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
            
            // Check user role again after Firebase auth
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.role !== 'admin' && currentUser.role !== 'sub-admin') {
                console.log('Firebase user does not have admin role, redirecting to dashboard');
                window.location.href = '/pages/dashboard/';
                return;
            }
            
            // Refresh token if needed
            firebaseUser.getIdToken().then((newToken) => {
                localStorage.setItem('token', newToken);
            });
        });
    }
    
    // Update user info in header
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userAvatarEl = document.getElementById('userAvatar');
    
    if (userNameEl) {
        userNameEl.textContent = user.full_name || user.email || 'Admin';
    }
    
    if (userRoleEl) {
        const roleText = user.role === 'admin' ? 'Administrator' : 'Sub-Administrator';
        userRoleEl.textContent = roleText;
    }
    
    if (userAvatarEl) {
        // If user has a photo URL, use it; otherwise use initials
        if (user.photoURL) {
            userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
        } else {
            const initials = (user.full_name || user.email || 'A').charAt(0).toUpperCase();
            userAvatarEl.textContent = initials;
        }
    }
    
    // Initialize admin panel
    initializeAdminPanel();
});

// Initialize admin panel
function initializeAdminPanel() {
    // Set up tab navigation
    setupTabNavigation();
    
    // Set up form handlers
    if (createSubAdminForm) {
        createSubAdminForm.addEventListener('submit', handleCreateSubAdmin);
    }
    
    // Set up logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Set up mobile menu
    setupMobileMenu();
    
    // Set up logout functionality
    setupLogout();

    // Load initial data
    loadSubAdmins();
    loadAllUsers();
    loadAdminDashboardData(); // Load admin dashboard data
}

// Set up tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            const content = document.getElementById(tabId);
            if (content) {
                content.classList.add('active');
            }
        });
    });
    
    // Activate first tab by default
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// Load admin dashboard data
async function loadAdminDashboardData() {
    try {
        const token = localStorage.getItem('token');
        
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
            if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers || 0;
            if (totalSubAdminsEl) totalSubAdminsEl.textContent = stats.totalSubAdmins || 0;
            if (totalVotesEl) totalVotesEl.textContent = stats.totalVotes || 0;
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
            renderRecentActivity(activity.recentActivity || []);
        }
        
    } catch (error) {
        console.error('Error loading admin dashboard data:', error);
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

// Handle create sub-admin form submission
async function handleCreateSubAdmin(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('subAdminEmail').value,
        password: document.getElementById('subAdminPassword').value,
        full_name: document.getElementById('subAdminName').value
    };
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/create-sub-admin`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Sub-admin created successfully!', 'success');
            createSubAdminForm.reset();
            loadSubAdmins(); // Refresh the sub-admins list
            loadAdminDashboardData(); // Refresh admin dashboard data
        } else {
            showMessage('Error creating sub-admin: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error creating sub-admin:', error);
        showMessage('Network error while creating sub-admin', 'error');
    }
}

// Delete sub-admin (admin only)
async function deleteSubAdmin(subAdminId) {
    if (!confirm('Are you sure you want to delete this sub-admin?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/sub-admin/${subAdminId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Sub-admin deleted successfully!', 'success');
            loadSubAdmins(); // Refresh the sub-admins list
            loadAdminDashboardData(); // Refresh admin dashboard data
        } else {
            showMessage('Error deleting sub-admin: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting sub-admin:', error);
        showMessage('Network error while deleting sub-admin', 'error');
    }
}

// Show message
function showMessage(message, type) {
    if (adminMessage) {
        adminMessage.textContent = message;
        adminMessage.className = `message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                adminMessage.className = 'message';
                adminMessage.textContent = '';
            }, 5000);
        }
    }
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

// Set up mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }
}

// Set up logout functionality
function setupLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Load sub-admins
async function loadSubAdmins() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/sub-admins`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            renderSubAdmins(data.subAdmins || []);
        } else {
            showMessage('Error loading sub-admins: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error loading sub-admins:', error);
        showMessage('Network error while loading sub-admins', 'error');
    }
}

// Render sub-admins
function renderSubAdmins(subAdmins) {
    if (!subAdminList) return;
    
    if (subAdmins.length === 0) {
        subAdminList.innerHTML = '<tr><td colspan="4" class="empty-state">No sub-admins found</td></tr>';
        return;
    }
    
    subAdminList.innerHTML = subAdmins.map(admin => `
        <tr>
            <td>${admin.full_name || 'N/A'}</td>
            <td>${admin.email}</td>
            <td>${new Date(admin.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteSubAdmin('${admin.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load all users
async function loadAllUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            renderUsers(data.users || []);
        } else {
            showMessage('Error loading users: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showMessage('Network error while loading users', 'error');
    }
}

// Render users
function renderUsers(users) {
    if (!userList) return;
    
    if (users.length === 0) {
        userList.innerHTML = '<tr><td colspan="4" class="empty-state">No users found</td></tr>';
        return;
    }
    
    userList.innerHTML = users.map(user => `
        <tr>
            <td>${user.full_name || 'N/A'}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('');
}