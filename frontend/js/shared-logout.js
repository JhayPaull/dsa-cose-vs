/**
 * Shared Logout Functionality
 * This script provides consistent logout behavior across all pages
 */

// Function to initialize logout functionality
function initializeLogout() {
    // Initialize logout button if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutLink = document.getElementById('logoutLink'); // Also check for logoutLink
    const logoutElement = logoutBtn || logoutLink; // Use whichever exists
    
    if (logoutElement) {
        // Check if event listener is already attached
        if (!logoutElement.hasAttribute('data-logout-initialized')) {
            // Prevent default anchor behavior
            logoutElement.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Use the centralized confirmLogout function if available
                if (typeof window.confirmLogout === 'function') {
                    window.confirmLogout();
                } else {
                    // Fallback to default behavior with confirmation
                    if (confirm('Are you sure you want to log out?')) {
                        performLogout();
                    }
                }
            });
            
            // Mark as initialized to prevent duplicate event listeners
            logoutElement.setAttribute('data-logout-initialized', 'true');
        }
    }
}

// Initialize logout when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLogout();
});

// Also expose the function globally so it can be called after dynamic content is loaded
window.initializeLogout = initializeLogout;

// Perform the actual logout (fallback function)
function performLogout() {
    try {
        // Show loading state if SweetAlert is available
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Logging out...',
                text: 'Please wait while we log you out.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }

        // Clear all authentication-related data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('registerFormData');
        localStorage.removeItem('loginFormData');
        
        // Sign out from Firebase if available
        if (window.firebaseAuth && typeof window.firebaseAuth.signOut === 'function') {
            window.firebaseAuth.signOut()
                .then(() => {
                    console.log('Firebase sign out successful');
                    redirectToLogin();
                })
                .catch((error) => {
                    console.error('Firebase sign out error:', error);
                    redirectToLogin();
                });
        } else if (window.auth && typeof window.auth.signOut === 'function') {
            // Alternative Firebase auth instance
            window.auth.signOut()
                .then(() => redirectToLogin())
                .catch(error => {
                    console.error('Firebase auth sign out error:', error);
                    redirectToLogin();
                });
        } else {
            // If no Firebase, just redirect
            redirectToLogin();
        }
    } catch (error) {
        console.error('Error during logout:', error);
        redirectToLogin();
    }
}

// Helper function to redirect to login page
function redirectToLogin() {
    // Close any open SweetAlert dialogs
    if (typeof Swal !== 'undefined') {
        Swal.close();
    }
    
    // Get the current hostname to handle both local and production environments
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    // Redirect to login page
    const loginUrl = isLocal 
        ? '/auth/login/'
        : 'https://dsa-cose-vs.web.app/auth/login/';
    
    window.location.href = loginUrl;
}

// Make the logout function available globally
window.performLogout = performLogout;

// Also export the confirmLogout function globally
window.confirmLogout = function() {
    // Check if SweetAlert2 is available
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, log me out',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                performLogout();
            }
        });
    } else {
        // Fallback to native confirm dialog
        if (confirm('Are you sure you want to log out?')) {
            performLogout();
        }
    }
};
