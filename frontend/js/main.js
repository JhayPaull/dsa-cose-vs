// Main JavaScript file for the landing page

// Set default backend URL for Firebase hosting
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on Firebase hosting and no backend URL is set
    if ((window.location.hostname === 'dsa-cose-vs.web.app' || 
         window.location.hostname === 'dsa-cose-vs.firebaseapp.com') &&
        !localStorage.getItem('backend_url')) {
        // Set default backend URL for Firebase hosting
        localStorage.setItem('backend_url', 'http://localhost:3001');
        console.log('Set default backend URL for Firebase hosting');
    }
    
    // Check if user is logged in and update UI accordingly
    checkUserAuthentication();
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn && menuOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            header.classList.toggle('mobile-menu-open');
            menuOverlay.classList.toggle('active');
        });
        
        menuOverlay.addEventListener('click', () => {
            header.classList.remove('mobile-menu-open');
            menuOverlay.classList.remove('active');
        });
    }
});

function checkUserAuthentication() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user) {
        // User is logged in, update user info
        updateUserDisplay(user);
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    } else {
        // User is not logged in, hide user nav or redirect to login
        const userNav = document.querySelector('.user-nav');
        if (userNav) {
            userNav.style.display = 'none';
        }
    }
}

function updateUserDisplay(user) {
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userAvatarEl = document.getElementById('userAvatar');
    
    if (userNameEl) {
        userNameEl.textContent = user.full_name || user.email || 'User';
    }
    
    if (userRoleEl) {
        const roleText = user.role === 'admin' ? 'Administrator' : 
                        user.role === 'sub-admin' ? 'Sub-Administrator' : 
                        'Voter';
        userRoleEl.textContent = roleText;
    }
    
    if (userAvatarEl) {
        // If user has a photo URL, use it; otherwise use initials
        if (user.photoURL) {
            userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
        } else {
            const initials = (user.full_name || user.email || 'U').charAt(0).toUpperCase();
            userAvatarEl.textContent = initials;
        }
    }
}

function logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/auth/login/';
}