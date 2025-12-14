// Profile JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    console.log('Profile auth check:', { token });
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '../auth/login/';
        return false;
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
                window.location.href = '../auth/login/';
                return false;
            }
            // Refresh token if needed
            firebaseUser.getIdToken().then((newToken) => {
                localStorage.setItem('token', newToken);
            });
        });
    }
    
    return true;
}

// Load user profile
async function loadProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            
            // Update profile fields
            document.getElementById('profileName').textContent = user.full_name || 'User';
            document.getElementById('profileFullName').textContent = user.full_name || '-';
            document.getElementById('profileStudentId').textContent = user.student_id || '-';
            document.getElementById('profileEmail').textContent = user.email || '-';
            
            const roleBadge = document.getElementById('profileRole');
            if (roleBadge) {
                roleBadge.textContent = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Voter';
            }
            
            if (user.created_at) {
                const date = new Date(user.created_at);
                document.getElementById('profileCreatedAt').textContent = date.toLocaleDateString();
            }
            
            // Update header
            const userNameEl = document.getElementById('userName');
            const userRoleEl = document.getElementById('userRole');
            const userAvatarEl = document.getElementById('userAvatar');
            
            if (userNameEl) {
                userNameEl.textContent = user.full_name || 'User';
            }
            
            if (userRoleEl) {
                const roleText = user.role === 'admin' ? 'Administrator' : 
                                user.role === 'sub-admin' ? 'Sub-Administrator' : 
                                'Voter';
                userRoleEl.textContent = roleText;
            }
            
            if (userAvatarEl) {
                if (user.photoURL) {
                    userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
                } else {
                    const initials = (user.full_name || 'U').charAt(0).toUpperCase();
                    userAvatarEl.textContent = initials;
                }
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../auth/login/';
    });
}

// Initialize profile
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (checkAuth()) {
            loadProfile();
        }
    });
} else {
    if (checkAuth()) {
        loadProfile();
    }
}