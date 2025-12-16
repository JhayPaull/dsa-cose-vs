// Profile JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    console.log('Profile auth check:', { token });
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '../auth/login/';
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
                window.location.href = '../auth/login/';
                return false;
            }
            // Refresh token if needed
            firebaseUser.getIdToken().then((newToken) => {
                localStorage.setItem('token', newToken);
            });
        });
    }
    
    return true;
}

// Load user profile from Firebase
async function loadProfile() {
    try {
        // Check if Firebase is available
        if (typeof window.firebaseAuth !== 'undefined' && typeof window.firebaseDb !== 'undefined') {
            // Get current user
            const user = window.firebaseAuth.currentUser;
            if (user) {
                // Fetch user data from Firestore
                const userDoc = await window.firebaseDb.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    
                    // Update profile display
                    document.getElementById('profileName').textContent = userData.firstName + ' ' + userData.lastName;
                    document.getElementById('fullName').textContent = userData.firstName + ' ' + userData.lastName;
                    document.getElementById('profileEmail').textContent = userData.email || user.email;
                    document.getElementById('studentId').textContent = userData.studentId || '-';
                    document.getElementById('yearLevel').textContent = userData.gradeLevel || '-';
                    document.getElementById('section').textContent = userData.section || '-';
                    
                    const roleBadge = document.getElementById('profileRole');
                    if (roleBadge) {
                        roleBadge.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Voter';
                    }
                    
                    if (userData.createdAt) {
                        const date = new Date(userData.createdAt);
                        document.getElementById('memberSince').textContent = date.toLocaleDateString();
                    }
                    
                    // Update header
                    const userNameEl = document.getElementById('userName');
                    const userRoleEl = document.getElementById('userRole');
                    
                    if (userNameEl) {
                        userNameEl.textContent = userData.firstName + ' ' + userData.lastName;
                    }
                    
                    if (userRoleEl) {
                        const roleText = userData.role === 'admin' ? 'Administrator' : 
                                        userData.role === 'sub-admin' ? 'Sub-Administrator' : 
                                        'Voter';
                        userRoleEl.textContent = roleText;
                    }
                    
                    return userData;
                }
            }
        } else {
            // Fallback to API if Firebase is not available
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                
                // Update profile fields
                document.getElementById('profileName').textContent = user.full_name || 'User';
                document.getElementById('fullName').textContent = user.full_name || '-';
                document.getElementById('profileEmail').textContent = user.email || '-';
                document.getElementById('studentId').textContent = user.student_id || '-';
                document.getElementById('yearLevel').textContent = user.grade_level || '-';
                document.getElementById('section').textContent = user.section || '-';
                
                const roleBadge = document.getElementById('profileRole');
                if (roleBadge) {
                    roleBadge.textContent = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Voter';
                }
                
                if (user.created_at) {
                    const date = new Date(user.created_at);
                    document.getElementById('memberSince').textContent = date.toLocaleDateString();
                }
                
                // Update header
                const userNameEl = document.getElementById('userName');
                const userRoleEl = document.getElementById('userRole');
                const userAvatarEl = document.getElementById('userAvatar');
                
                if (userNameEl) {
                    userNameEl.textContent = user.full_name || 'User';
                }
                
                if (userRoleEl) {
                    const roleText = user.role === 'admin' ? 'Administrator' : 
                                    user.role === 'sub-admin' ? 'Sub-Administrator' : 
                                    'Voter';
                    userRoleEl.textContent = roleText;
                }
                
                if (userAvatarEl) {
                    if (user.photoURL) {
                        userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
                    } else {
                        const initials = (user.full_name || 'U').charAt(0).toUpperCase();
                        userAvatarEl.textContent = initials;
                    }
                }
                
                return user;
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Populate edit profile modal with current user data
async function populateEditProfileModal() {
    try {
        const userData = await loadProfile();
        if (userData) {
            // Set the year level dropdown
            const yearLevelSelect = document.getElementById('editYearLevel');
            if (yearLevelSelect) {
                yearLevelSelect.value = userData.gradeLevel || '';
            }
            
            // Set the section dropdown
            const sectionSelect = document.getElementById('editSection');
            if (sectionSelect) {
                sectionSelect.value = userData.section || '';
            }
            
            // Set the email field
            const emailInput = document.getElementById('editEmail');
            if (emailInput) {
                emailInput.value = userData.email || '';
            }
        }
    } catch (error) {
        console.error('Error populating edit profile modal:', error);
    }
}

// Handle edit profile form submission
document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const yearLevel = document.getElementById('editYearLevel').value;
            const section = document.getElementById('editSection').value;
            const email = document.getElementById('editEmail').value;
            
            try {
                // Check if Firebase is available
                if (typeof window.firebaseAuth !== 'undefined' && typeof window.firebaseDb !== 'undefined') {
                    // Get current user
                    const user = window.firebaseAuth.currentUser;
                    if (user) {
                        // Update email if it has changed
                        if (user.email !== email) {
                            await user.updateEmail(email);
                        }
                        
                        // Update user document in Firestore
                        await window.firebaseDb.collection('users').doc(user.uid).update({
                            gradeLevel: yearLevel,
                            section: section,
                            email: email,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        
                        // Close modal and show success message
                        document.getElementById('editProfileModal').style.display = 'none';
                        alert('Profile updated successfully!');
                        
                        // Reload profile data
                        loadProfile();
                    }
                } else {
                    // Fallback to API if Firebase is not available
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            grade_level: yearLevel,
                            section: section,
                            email: email
                        })
                    });
                    
                    if (response.ok) {
                        // Close modal and show success message
                        document.getElementById('editProfileModal').style.display = 'none';
                        alert('Profile updated successfully!');
                        
                        // Reload profile data
                        loadProfile();
                    } else {
                        alert('Failed to update profile.');
                    }
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile: ' + error.message);
            }
        });
    }
});

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../auth/login/';
    });
}

// Initialize profile
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (checkAuth()) {
            loadProfile();
        }
    });
} else {
    if (checkAuth()) {
        loadProfile();
    }
}

// Event listeners for modal controls
document.addEventListener('DOMContentLoaded', function() {
    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditProfile = document.getElementById('closeEditProfile');
    
    if (editProfileBtn && editProfileModal) {
        editProfileBtn.addEventListener('click', async function() {
            // Populate modal with current data
            await populateEditProfileModal();
            // Show modal
            editProfileModal.style.display = 'block';
        });
    }
    
    if (closeEditProfile && editProfileModal) {
        closeEditProfile.addEventListener('click', function() {
            editProfileModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });
});
