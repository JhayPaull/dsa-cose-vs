// Load sidebar based on user role
document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
});

function loadSidebar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sidebarContainer = document.querySelector('.sidebar-container');
    
    if (!sidebarContainer) {
        console.error('Sidebar container not found');
        return;
    }
    
    let sidebarPath = '';
    if (user.role === 'admin' || user.role === 'sub-admin') {
        sidebarPath = '/components/sidebar/admin-sidebar.html';
    } else {
        sidebarPath = '/components/sidebar/student-sidebar.html';
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
                <aside class="sidebar">
                    <nav class="sidebar-nav">
                        <a href="/pages/dashboard/" class="nav-link active">
                            <i class="nav-icon fas fa-home"></i>
                            <p>Dashboard</p>
                        </a>
                        <a href="#" class="nav-link" id="logoutLink">
                            <i class="nav-icon fas fa-sign-out-alt"></i>
                            <p>Logout</p>
                        </a>
                    </nav>
                </aside>
            `;
            setupSidebarEvents();
        });
}

function setupSidebarEvents() {
    // Set up logout confirmation
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            confirmLogout();
        });
    }
    
    // Set up active link highlighting
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href)) {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to current item
            item.classList.add('active');
        }
    });
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