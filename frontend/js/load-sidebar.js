 // Load sidebar based on user role
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadSidebar();
    loadFooter();
});

function loadNavbar() {
    const navbarContainer = document.querySelector('#navbar-container');
    
    if (!navbarContainer) {
        console.error('Navbar container not found');
        return;
    }
    
    // Load shared navbar component
    fetch('/components/shared-navbar.html')
        .then(response => response.text())
        .then(html => {
            navbarContainer.innerHTML = html;
            
            // Set the correct home link based on user role
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const homeLink = navbarContainer.querySelector('.home-link');
            
            if (homeLink) {
                if (user.role === 'admin' || user.role === 'sub-admin') {
                    homeLink.href = '/pages/dashboard/';
                } else {
                    homeLink.href = '/page/dashboard/';
                }
            }
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            // Fallback to default navbar based on user role
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const homeHref = (user.role === 'admin' || user.role === 'sub-admin') ? '/pages/dashboard/' : '/page/dashboard/';
            
            navbarContainer.innerHTML = `
                <nav class="main-header navbar navbar-expand navbar-dark" style="background-color: #800000;">
                    <!-- Left navbar links -->
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                        </li>
                        <li class="nav-item d-none d-sm-inline-block">
                            <a href="${homeHref}" class="nav-link">Home</a>
                        </li>
                    </ul>

                    <!-- Right navbar links -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Notifications Dropdown Menu -->
                        <li class="nav-item dropdown">
                            <a class="nav-link" data-toggle="dropdown" href="#">
                                <i class="far fa-bell"></i>
                                <span class="badge badge-warning navbar-badge">15</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                                <span class="dropdown-item dropdown-header">15 Notifications</span>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item">
                                    <i class="fas fa-envelope mr-2"></i> 4 new messages
                                    <span class="float-right text-muted text-sm">3 mins</span>
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item">
                                    <i class="fas fa-users mr-2"></i> 8 friend requests
                                    <span class="float-right text-muted text-sm">12 hours</span>
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item">
                                    <i class="fas fa-file mr-2"></i> 3 new reports
                                    <span class="float-right text-muted text-sm">2 days</span>
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            `;
        });
}

function loadSidebar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sidebarContainer = document.querySelector('#sidebar-container');
    
    if (!sidebarContainer) {
        console.error('Sidebar container not found');
        return;
    }
    
    let sidebarPath = '';
    // Allow access to admin sidebar even without authentication for account settings page
    if (user.role === 'admin' || user.role === 'sub-admin' || window.location.pathname.includes('/pages/admin/acc-setting/')) {
        sidebarPath = '/components/admin-sidebar.html';
    } else if (user.role === 'voter') {
        sidebarPath = '/components/sidebar/voter-sidebar.html';
    } else {
        sidebarPath = '/components/student-sidebar.html';
    }
    
    fetch(sidebarPath)
        .then(response => response.text())
        .then(html => {
            sidebarContainer.innerHTML = html;
            setupSidebarEvents();
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
            // Fallback to default sidebar
            sidebarContainer.innerHTML = `
                <div class="sidebar">
                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar flex-column">
                            <li class="nav-item">
                                <a href="/pages/dashboard/" class="nav-link">
                                    <i class="nav-icon fas fa-home"></i>
                                    <p>Dashboard</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/pages/admin/acc-setting/" class="nav-link active">
                                    <i class="nav-icon fas fa-cog"></i>
                                    <p>Account Settings</p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            `;
            setupSidebarEvents();
        });
}

function loadFooter() {
    const footerContainer = document.querySelector('.copyright');
    
    if (!footerContainer) {
        console.warn('Footer container not found');
        return;
    }
    
    // Load shared footer component
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(html => {
            footerContainer.outerHTML = html;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            // Fallback to default footer
            footerContainer.outerHTML = `
                <footer class="copyright text-center">
                    <div class="container">
                        <p class="mb-0 py-3">© 2025 Tagoloan Community College. All rights reserved.</p>
                    </div>
                </footer>
            `;
        });
}

function setupSidebarEvents() {
    // Set up logout confirmation
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        // Remove any existing event listeners to prevent duplicates
        const newLogoutLink = logoutLink.cloneNode(true);
        logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
        
        newLogoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            confirmLogout();
        });
    }
    
    // Set up navigation link behavior - Allow default behavior for navigation links
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        
        // Skip logout link and empty hrefs
        if (!href || href === '#') {
            return;
        }
        
        // For navigation links, we want to allow default behavior
        // So we don't add any special event listeners that would prevent default
        // The links should work normally with their href attributes
    });
    
    // Set up active link highlighting with a small delay to ensure DOM is ready
    setTimeout(function() {
        const currentPath = window.location.pathname;
        const allNavItems = document.querySelectorAll('.nav-link');
        
        // Remove active class from all items first
        allNavItems.forEach(navItem => navItem.classList.remove('active'));
        
        // Add active class to matching item
        let activeFound = false;
        allNavItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href !== '#' && currentPath.includes(href)) {
                item.classList.add('active');
                activeFound = true;
            }
        });
        
        // Special case for account settings page - if no other link matched, activate account settings
        if (!activeFound && currentPath.includes('/pages/admin/acc-setting/')) {
            const accSettingLink = document.querySelector('a[href="/pages/admin/acc-setting/"]');
            if (accSettingLink) {
                accSettingLink.classList.add('active');
            }
        }
        // Special case for dashboard - if no other link matched, activate dashboard
        else if (!activeFound) {
            const dashboardLink = document.getElementById('dashboard-link');
            if (dashboardLink) {
                dashboardLink.classList.add('active');
            }
        }
    }, 100);
}

function confirmLogout() {
    // Check if SweetAlert2 is available
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Are you sure you want to log out?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#800000',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-sign-out-alt"></i> Yes, log out',
            cancelButtonText: '<i class="fas fa-times"></i> Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                performLogout();
            }
        });
    } else {
        // Fallback to native confirm dialog
        if (confirm('Are you sure you want to logout?')) {
            performLogout();
        }
    }
}

function performLogout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Sign out from Firebase if available
    if (window.firebaseAuth && typeof window.firebaseAuth.signOut === 'function') {
        window.firebaseAuth.signOut()
            .then(() => {
                console.log('Firebase sign out successful');
                // Redirect to login
                window.location.href = 'https://dsa-cose-vs.web.app/auth/login/';
            })
            .catch((error) => {
                console.error('Firebase sign out error:', error);
                // Even if Firebase sign out fails, redirect to login
                window.location.href = 'https://dsa-cose-vs.web.app/auth/login/';
            });
    } else {
        // Redirect to login page
        window.location.href = 'https://dsa-cose-vs.web.app/auth/login/';
    }
}