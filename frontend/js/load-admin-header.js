// Function to initialize header functionality for admin/student
function initAdminHeader() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const menuOverlay = document.getElementById('menuOverlay');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    // Toggle sidebar on mobile
    if (mobileMenuBtn && sidebar && menuOverlay) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.body.classList.toggle('sidebar-open');
            menuOverlay.classList.toggle('active');
        });

        menuOverlay.addEventListener('click', function() {
            document.body.classList.remove('sidebar-open');
            menuOverlay.classList.remove('active');
        });
    }

    // Toggle user dropdown
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
        });

        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Close dropdown when clicking on menu items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            if (userDropdown) {
                userDropdown.classList.remove('show');
            }
        });
    });
}

// Load admin/student header content
document.addEventListener('DOMContentLoaded', function() {
    // Create header container
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header-container';
    
    // Insert at the beginning of the body
    if (document.body.firstChild) {
        document.body.insertBefore(headerContainer, document.body.firstChild);
    } else {
        document.body.appendChild(headerContainer);
    }

    // Fetch and insert header content
    fetch('/components/headers/admin-student-header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            headerContainer.innerHTML = html;
            
            // Update user role based on current page
            const userRoleElement = document.getElementById('userRole');
            if (userRoleElement) {
                if (window.location.pathname.includes('/pages/admin/') || window.location.pathname.includes('/pages/dashboard/')) {
                    userRoleElement.textContent = 'Admin';
                } else {
                    userRoleElement.textContent = 'Student';
                }
            }
            
            // Initialize header functionality
            initAdminHeader();
        })
        .catch(error => {
            console.error('Error loading admin header:', error);
            headerContainer.innerHTML = `
                <header class="admin-header">
                    <div class="container">
                        <div class="logo">
                            <div class="logo-container">
                                <img src="/images/logo1.png" alt="Logo 1" class="logo-image">
                                <img src="/images/logo2.png" alt="Logo 2" class="logo-image">
                                <img src="/images/logo3.png" alt="Logo 3" class="logo-image">
                            </div>
                            <div class="logo-text">
                                <h1>TAGOLOAN COMMUNITY COLLEGE</h1>
                                <p>E-Voting System - <span id="userRole">${(window.location.pathname.includes('/pages/admin/') || window.location.pathname.includes('/pages/dashboard/')) ? 'Admin' : 'Student'}</span> Portal</p>
                            </div>
                        </div>
                    </div>
                </header>`;
            initAdminHeader();
        });
});
