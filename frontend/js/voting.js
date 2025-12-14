// Voting JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// DOM Elements
const voteForm = document.getElementById('voteForm');
const candidatesContainer = document.getElementById('candidatesContainer');
const timerElement = document.getElementById('timer');
const votingMessage = document.getElementById('votingMessage');

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    console.log('Voting auth check:', { token });
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/auth/login/';
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
                window.location.href = '/auth/login/';
                return false;
            }
            // Refresh token if needed
            firebaseUser.getIdToken().then((newToken) => {
                localStorage.setItem('token', newToken);
            });
        });
    }
    
    // Update user info in header
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userAvatarEl = document.getElementById('userAvatar');
    
    if (userNameEl) {
        userNameEl.textContent = user.full_name || user.email || 'User';
    }
    
    if (userRoleEl) {
        const roleText = user.role === 'admin' ? 'Administrator' : 
                        user.role === 'sub-admin' ? 'Sub-Administrator' : 
                        'Voter';
        userRoleEl.textContent = roleText;
    }
    
    if (userAvatarEl) {
        // If user has a photo URL, use it; otherwise use initials
        if (user.photoURL) {
            userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
        } else {
            const initials = (user.full_name || user.email || 'U').charAt(0).toUpperCase();
            userAvatarEl.textContent = initials;
        }
    }
    
    return true;
}

// Load active elections and candidates
async function loadVotingData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/voting/elections`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            renderVotingInterface(data);
        } else {
            document.getElementById('votingContainer').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-vote-yea"></i>
                    <p>No active elections at this time</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading voting data:', error);
        document.getElementById('votingContainer').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading election data. Please try again later.</p>
            </div>
        `;
    }
}

// Render voting interface
function renderVotingInterface(data) {
    const container = document.getElementById('votingContainer');
    
    if (!data.elections || data.elections.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-vote-yea"></i>
                <p>No active elections at this time</p>
            </div>
        `;
        return;
    }
    
    const election = data.elections[0];
    const candidates = data.candidates || [];
    
    // Group candidates by position
    const candidatesByPosition = {};
    candidates.forEach(candidate => {
        if (!candidatesByPosition[candidate.position]) {
            candidatesByPosition[candidate.position] = [];
        }
        candidatesByPosition[candidate.position].push(candidate);
    });
    
    let html = `
        <div class="election-info">
            <h3>${election.title}</h3>
            <p>${election.description || ''}</p>
            <p class="election-dates">
                <i class="fas fa-calendar"></i> 
                ${new Date(election.start_date).toLocaleDateString()} - 
                ${new Date(election.end_date).toLocaleDateString()}
            </p>
        </div>
        
        <form id="voteForm">
    `;
    
    // Render candidates by position
    Object.keys(candidatesByPosition).forEach(position => {
        html += `
            <div class="position-section">
                <h4>${position}</h4>
                <div class="candidates-grid">
        `;
        
        candidatesByPosition[position].forEach(candidate => {
            html += `
                <div class="candidate-card-enhanced">
                    <input type="radio" 
                           name="position_${position}" 
                           value="${candidate.id}" 
                           id="candidate_${candidate.id}"
                           required>
                    <label for="candidate_${candidate.id}">
                        <div class="selected-indicator">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="candidate-photo-enhanced">
                            ${candidate.photo_url ? 
                                `<img src="${candidate.photo_url}" alt="${candidate.name}">` : 
                                `<i class="fas fa-user"></i>`
                            }
                        </div>
                        <div class="candidate-info-enhanced">
                            <h5>${candidate.name}</h5>
                            ${candidate.party ? `<p class="party">${candidate.party}</p>` : ''}
                            ${candidate.bio ? `<p class="bio">${candidate.bio}</p>` : ''}
                        </div>
                    </label>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            <input type="hidden" name="electionId" value="${election.id}">
            <button type="submit" class="btn btn-primary btn-block btn-large">
                <i class="fas fa-check-circle"></i> Submit Vote
            </button>
        </form>
        <div id="voteMessage" class="message"></div>
    `;
    
    container.innerHTML = html;
    
    // Add form submit handler
    const voteForm = document.getElementById('voteForm');
    if (voteForm) {
        voteForm.addEventListener('submit', handleVoteSubmit);
    }
}

// Handle vote submission
async function handleVoteSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const electionId = formData.get('electionId');
    const votes = {};
    
    // Collect votes by position
    formData.forEach((value, key) => {
        if (key.startsWith('position_')) {
            const position = key.replace('position_', '');
            votes[position] = parseInt(value);
        }
    });
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/voting/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                electionId: parseInt(electionId),
                votes: votes
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('voteMessage', 'Vote submitted successfully!', 'success');
            setTimeout(() => {
                // Redirect based on user role
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.role === 'admin') {
                    window.location.href = '/pages/admin/';
                } else {
                    window.location.href = '/pages/dashboard/';
                }
            }, 2000);
        } else {
            showMessage('voteMessage', data.message || 'Failed to submit vote', 'error');
        }
    } catch (error) {
        console.error('Vote submission error:', error);
        showMessage('voteMessage', 'Network error. Please try again.', 'error');
    }
}

// Show message
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
    }
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login/';
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('menuOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Close mobile menu when clicking overlay
function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('menuOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Initialize voting page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (checkAuth()) {
            loadUserInfo();
            loadVotingData();
            
            // Mobile menu event listeners
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const menuOverlay = document.getElementById('menuOverlay');
            
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            }
            
            if (menuOverlay) {
                menuOverlay.addEventListener('click', closeMobileMenu);
            }
        }
    });
} else {
    if (checkAuth()) {
        loadUserInfo();
        loadVotingData();
        
        // Mobile menu event listeners
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
        
        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMobileMenu);
        }
    }
}