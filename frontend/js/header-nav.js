document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation elements
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebar = document.querySelector('.sidebar');
    const menuOverlay = document.getElementById('menuOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // Handle logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Use the centralized confirmLogout function from auth.js
            if (typeof window.confirmLogout === 'function') {
                window.confirmLogout();
            } else {
                // Fallback to default behavior if confirmLogout is not available
                if (confirm('Are you sure you want to log out?')) {
                    performLogout();
                }
            }
        });
    }
    
    // Perform actual logout (fallback function)
    function performLogout() {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('registerFormData');
        localStorage.removeItem('loginFormData');
        
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
            window.location.href = 'https://dsa-cose-vs.web.app/auth/login/';
        }
    }

    // Set active link based on current URL
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-item');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.startsWith(linkPath) && linkPath !== '/') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Load user data
    function loadUserData() {
        // Example: Load user data from your authentication system
        // const user = firebase.auth().currentUser;
        // if (user) {
        //     document.getElementById('userName').textContent = user.displayName || 'User';
        //     document.getElementById('userEmail').textContent = user.email;
        // }
    }

    // Event Listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Close sidebar when clicking outside (if sidebar exists)
    if (sidebar && menuOverlay) {
        menuOverlay.addEventListener('click', function(e) {
            const clickedInSidebar = e.target.closest('.sidebar');
            if (!clickedInSidebar) {
                sidebar.classList.remove('show');
                menuOverlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    document.addEventListener('click', function closeDropdowns(e) {
        if (userDropdown) {
            // Check if click is outside the dropdown and not on the bars button
            const clickedBars = e.target.closest('#mobileMenuBtn') || e.target.closest('.fa-bars');
            const clickedInDropdown = e.target.closest('.dropdown-menu');
            
            // If clicking outside both the dropdown and the bars button, close the dropdown
            if (!clickedBars && !clickedInDropdown) {
                userDropdown.style.display = 'none';
                
                // Also close the sidebar if it's open
                if (sidebar && sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                    menuOverlay.classList.remove('show');
                    document.body.classList.remove('no-scroll');
                }
            }
        }
    });

    // Initialize - ensure dropdown is hidden on page load
    if (userDropdown) {
        userDropdown.classList.remove('show');
    }
    if (userMenuBtn) {
        userMenuBtn.classList.remove('active');
    }
    
    setActiveLink();
    loadUserData();

    // Close dropdown when clicking on a link
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            if (userDropdown) {
                userDropdown.classList.remove('show');
            }
            if (userMenuBtn) {
                userMenuBtn.classList.remove('active');
            }
            if (window.innerWidth <= 992) {
                toggleMobileMenu();
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 992) {
                sidebar.classList.remove('show');
                menuOverlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
            }
        }, 250);
    });
});
