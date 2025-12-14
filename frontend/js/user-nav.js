// User Navigation Dropdown
document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdown menu
    const userNav = document.querySelector('.user-nav');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle dropdown when clicking on user nav
    if (userNav) {
        userNav.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userNav.contains(e.target)) {
            userNav.classList.remove('active');
        }
    });

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your logout logic here
            window.location.href = '/logout';
        });
    }

    // Close dropdown when clicking on a dropdown item
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            userNav.classList.remove('active');
        });
    });
});

// Add this to your main JavaScript file or include it separately
function updateUserName(userData) {
    // With the new logo-based dropdown, we don't display the username in the button
    // But we could add it as a dropdown item if needed
    console.log('User data updated:', userData);
}
