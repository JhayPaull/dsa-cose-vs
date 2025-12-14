// Notifications JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    console.log('Notifications auth check:', { token });
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/auth/login/';
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
                window.location.href = '/auth/login/';
                return false;
            }
            // Refresh token if needed
            firebaseUser.getIdToken().then((newToken) => {
                localStorage.setItem('token', newToken);
            });
        });
    }
    
    // Update user info in header
    const user = JSON.parse(localStorage.getItem('user') || '{}');
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
    
    return true;
}

// Load notifications
async function loadNotifications(filter = 'all') {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/notifications?filter=${filter}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateNotificationBadge(data.unreadCount || 0);
            
            if (window.location.pathname.includes('notifications.html')) {
                renderNotifications(data.notifications || []);
            } else {
                renderNotificationPanel(data.notifications || []);
            }
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Update notification badge
function updateNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Render notifications in panel
function renderNotificationPanel(notifications) {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;
    
    if (notifications.length === 0) {
        notificationList.innerHTML = '<p class="empty-state">No notifications</p>';
        return;
    }
    
    notificationList.innerHTML = notifications.slice(0, 10).map(notification => `
        <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
            <div class="notification-icon">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${formatTime(notification.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

// Render notifications in page
function renderNotifications(notifications) {
    const container = document.getElementById('notificationsContainer');
    const emptyState = document.getElementById('emptyNotifications');
    
    if (!container) return;
    
    if (notifications.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
            <div class="notification-icon">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${formatTime(notification.createdAt)}</span>
            </div>
            <div class="notification-actions">
                ${!notification.read ? `
                    <button class="icon-btn mark-read-btn" title="Mark as read">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ''}
                <button class="icon-btn delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    container.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            markAsRead(item.dataset.id);
        });
    });
    
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            deleteNotification(item.dataset.id);
        });
    });
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle',
        'vote': 'vote-yea',
        'election': 'calendar-alt'
    };
    return icons[type] || 'bell';
}

// Format time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
}

// Mark notification as read
async function markAsRead(notificationId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            loadNotifications();
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Delete notification
async function deleteNotification(notificationId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            loadNotifications();
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
}

// Mark all as read
const markAllReadBtn = document.getElementById('markAllReadBtn');
if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                loadNotifications();
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    });
}

// Clear all notifications
const clearAllBtn = document.getElementById('clearAllBtn');
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to clear all notifications?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                loadNotifications();
            }
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    });
}

// Notification panel toggle
const notificationsIcon = document.getElementById('notificationsIcon');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotifications = document.getElementById('closeNotifications');

if (notificationsIcon && notificationPanel) {
    notificationsIcon.addEventListener('click', () => {
        notificationPanel.classList.toggle('open');
        if (notificationPanel.classList.contains('open')) {
            loadNotifications();
        }
    });
}

if (closeNotifications) {
    closeNotifications.addEventListener('click', () => {
        notificationPanel.classList.remove('open');
    });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        loadNotifications(filter);
    });
});

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login/';
    });
}

// Initialize notifications
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (checkAuth()) {
            loadNotifications();
            // Refresh notifications every 30 seconds
            setInterval(loadNotifications, 30000);
        }
    });
} else {
    if (checkAuth()) {
        loadNotifications();
        setInterval(loadNotifications, 30000);
    }
}