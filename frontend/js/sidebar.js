// Function to highlight the active link in the sidebar
function setActiveLink() {
    // Get the current page URL
    const currentPage = window.location.pathname;
    
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Define page mappings to link IDs
    const pageMappings = {
        '/pages/dashboard/': 'dashboard-link',
        '/pages/admin/manage-elections/': 'manage-elections-link',
        '/pages/admin/voting-history/': 'voting-history-link',
        '/pages/admin/manage-users/': 'manage-users-link',
        '/pages/admin/sub-admins/': 'sub-admins-link',
        '/pages/admin/analytics/': 'analytics-link',
        '/pages/admin/edit-slider/': 'edit-slider-link',
        '/pages/admin/acc-setting/': 'acc-setting-link'
    };
    
    // Add active class to the current page link
    if (pageMappings[currentPage]) {
        const activeLink = document.getElementById(pageMappings[currentPage]);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveLink();
});