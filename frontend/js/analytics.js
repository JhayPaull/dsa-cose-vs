// Analytics JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    console.log('Analytics auth check:', { token });
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

// Load analytics data
async function loadAnalytics() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/analytics/data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update summary stats
            document.getElementById('totalVotes').textContent = data.totalVotes || 0;
            document.getElementById('registeredVoters').textContent = data.registeredVoters || 0;
            document.getElementById('voterTurnout').textContent = `${data.voterTurnout || 0}%`;
            document.getElementById('electionStatus').textContent = data.electionStatus || 'Active';
            
            // Render charts
            renderVoteDistributionChart(data.voteDistribution || []);
            renderVotingTrendsChart(data.votingTrends || []);
            renderTurnoutChart(data.turnoutData || []);
            
            // Update candidate table
            updateCandidateTable(data.candidates || []);
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Render vote distribution chart
function renderVoteDistributionChart(data) {
    const ctx = document.getElementById('voteDistributionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => item.candidate),
            datasets: [{
                data: data.map(item => item.votes),
                backgroundColor: [
                    '#800020',
                    '#FFD700',
                    '#5a0017',
                    '#ccaa00',
                    '#a0002a',
                    '#ffed4e'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render voting trends chart
function renderVotingTrendsChart(data) {
    const ctx = document.getElementById('votingTrendsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.time),
            datasets: [{
                label: 'Votes',
                data: data.map(item => item.count),
                borderColor: '#800020',
                backgroundColor: 'rgba(128, 0, 32, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Render turnout chart
function renderTurnoutChart(data) {
    const ctx = document.getElementById('turnoutChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.period),
            datasets: [{
                label: 'Turnout',
                data: data.map(item => item.percentage),
                backgroundColor: '#FFD700',
                borderColor: '#ccaa00',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Update candidate table
function updateCandidateTable(candidates) {
    const tbody = document.getElementById('candidateTableBody');
    if (!tbody) return;
    
    if (candidates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No data available</td></tr>';
        return;
    }
    
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    
    tbody.innerHTML = candidates.map(candidate => `
        <tr>
            <td>${candidate.name}</td>
            <td>${candidate.position}</td>
            <td>${candidate.votes}</td>
            <td>${totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : 0}%</td>
        </tr>
    `).join('');
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

// Export report
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/analytics/export`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `election-report-${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Failed to export report. Please try again.');
        }
    });
}

// Initialize analytics
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (checkAuth()) {
            loadAnalytics();
            // Refresh analytics every 10 seconds for real-time updates
            setInterval(loadAnalytics, 10000);
        }
    });
} else {
    if (checkAuth()) {
        loadAnalytics();
        setInterval(loadAnalytics, 10000);
    }
}