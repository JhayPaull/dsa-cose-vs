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
                        <a href="/pages/dashboard/" class="nav-item active">
                            <i class="fas fa-home"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="#" class="nav-item" id="logoutLink">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
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
    const navItems = document.querySelectorAll('.nav-item');
    
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
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'logoutModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'logoutModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="logoutModalLabel">Confirm Logout</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to logout?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmLogoutBtn">Logout</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Handle confirm logout
    document.getElementById('confirmLogoutBtn').addEventListener('click', function() {
        performLogout();
        bootstrapModal.hide();
        modal.remove();
    });
    
    // Clean up modal after it's hidden
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
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
                window.location.href = '/auth/login/';
            })
            .catch((error) => {
                console.error('Firebase sign out error:', error);
                // Even if Firebase sign out fails, redirect to login
                window.location.href = '/auth/login/';
            });
    } else {
        // Redirect to login page
        window.location.href = '/auth/login/';
    }
}