// Admin Menu JavaScript
// This script handles active state for navigation items

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin or sub-admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Set active state for current page
    setActiveNavigation();
    
    // Add event listeners for navigation
    addNavigationEventListeners();
});

function setActiveNavigation() {
    // Get current page path
    const currentPage = window.location.pathname;
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current page item
    const currentNavItem = document.querySelector(`.nav-item[href="${currentPage}"]`);
    if (currentNavItem) {
        currentNavItem.classList.add('active');
    }
    
    // Special case for index pages
    if (currentPage === '/') {
        const dashboardItem = document.querySelector('.nav-item[href="/pages/dashboard/"]');
        if (dashboardItem) {
            dashboardItem.classList.add('active');
        }
    }
}

function addNavigationEventListeners() {
    // Add event listeners for all navigation links
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        // Skip the admin link as it's already handled above
        const href = item.getAttribute('href');
        if (href) {
            item.addEventListener('click', function(e) {
                // For Firebase hosted version, we need to handle navigation differently
                if (window.location.hostname === 'dsa-cose-vs.web.app' || 
                    window.location.hostname === 'dsa-cose-vs.firebaseapp.com') {
                    // Prevent default behavior for same page navigation
                    if (href === window.location.pathname) {
                        e.preventDefault();
                        return false;
                    }
                }
            });
        }
    });
}