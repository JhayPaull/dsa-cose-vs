// Authentication JavaScript

// Use shared API configuration
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3001/api';

// DOM Ready Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});

// Initialize Authentication
function initAuth() {
    console.log('Initializing auth system');
    console.log('API Base URL:', API_BASE_URL);
    
    // Restore saved form data
    restoreFormData();
    
    // Register Form Handler
    const registerForm = document.getElementById('registerForm');
    console.log('Register form found:', registerForm);
    if (registerForm) {
        // Save form data on input changes
        const formInputs = registerForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('input', saveFormData);
            input.addEventListener('change', saveFormData);
        });
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Register form submitted');
            
            // Set form submission flag to prevent security warning on reload
            sessionStorage.setItem('formSubmitted', 'true');
            
            const formData = {
                lastName: document.getElementById('lastName').value.trim(),
                firstName: document.getElementById('firstName').value.trim(),
                middleInitial: document.getElementById('middleInitial').value.trim(),
                course: document.getElementById('course').value,
                year: document.getElementById('year').value,
                section: document.getElementById('section').value,
                studentId: document.getElementById('studentId').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            
            // Validation
            if (!formData.lastName || !formData.firstName || !formData.course || 
                !formData.year || !formData.section || !formData.studentId || 
                !formData.email || !formData.password) {
                showMessage('registerMessage', 'Please fill in all required fields', 'error');
                sessionStorage.removeItem('formSubmitted');
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                showMessage('registerMessage', 'Passwords do not match', 'error');
                sessionStorage.removeItem('formSubmitted');
                return;
            }
            
            if (formData.password.length < 6) {
                showMessage('registerMessage', 'Password must be at least 6 characters', 'error');
                sessionStorage.removeItem('formSubmitted');
                return;
            }
            
            try {
                console.log('Registration attempt with:', { 
                    email: formData.email, 
                    studentId: formData.studentId,
                    password: '***' 
                });
                showMessage('registerMessage', 'Creating account...', 'info');
                
                // Register via backend API
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                console.log('Registration response status:', response.status);
                
                let data;
                try {
                    data = await response.json();
                } catch (parseError) {
                    throw new Error('Invalid response from server. Please check if the backend is running.');
                }
                
                if (!response.ok) {
                    throw new Error(data.message || `Registration failed with status ${response.status}`);
                }
                
                console.log('Registration successful:', data);
                
                // Auto-login after registration
                showMessage('registerMessage', 'Registration successful! Logging you in...', 'success');
                
                // Clear form and saved data
                registerForm.reset();
                localStorage.removeItem('registerFormData');
                
                // Auto-login with the registered credentials
                setTimeout(async () => {
                    try {
                        // Login via backend API
                        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: formData.email,
                                password: formData.password
                            })
                        });
                        
                        let loginData;
                        try {
                            loginData = await loginResponse.json();
                        } catch (parseError) {
                            throw new Error('Invalid response from server. Please check if the backend is running.');
                        }
                        
                        if (!loginResponse.ok) {
                            throw new Error(loginData.message || `Login failed with status ${loginResponse.status}`);
                        }
                        
                        // Store token and user data in localStorage
                        localStorage.setItem('token', loginData.token);
                        localStorage.setItem('user', JSON.stringify(loginData.user));
                        
                        // Clear the form submission flag
                        sessionStorage.removeItem('formSubmitted');
                        
                        // Redirect based on user role
                        console.log('Redirecting user based on role:', loginData.user.role);
                        setTimeout(() => {
                            const user = loginData.user;
                            if (user.role === 'admin' || user.role === 'sub-admin') {
                                console.log('Redirecting admin to admin panel');
                                window.location.href = '/pages/admin/';
                            } else {
                                console.log('Redirecting voter to dashboard');
                                window.location.href = '/pages/dashboard/';
                            }
                        }, 500);
                    } catch (loginError) {
                        console.error('Auto-login error:', loginError);
                        // If auto-login fails, redirect to login page
                        sessionStorage.removeItem('formSubmitted');
                        window.location.href = '/auth/login/';
                    }
                }, 1000);
            } catch (error) {
                console.error('Registration error:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    apiUrl: API_BASE_URL
                });
                
                let errorMessage = error.message || 'Registration failed. Please try again.';
                
                // Check if it's a network error
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    errorMessage = `Cannot connect to server. Please ensure the backend is running. Current backend URL: ${API_BASE_URL}`;
                }
                
                // Clear the form submission flag on error
                sessionStorage.removeItem('formSubmitted');
                
                showMessage('registerMessage', errorMessage, 'error');
            }
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    console.log('Login form found:', loginForm);
    if (loginForm) {
        // Save form data on input changes
        const formInputs = loginForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('input', saveFormData);
            input.addEventListener('change', saveFormData);
        });
        
        // SECURITY: Immediately clear URL parameters if they contain credentials
        // This must happen before any form interaction
        const urlParams = new URLSearchParams(window.location.search);
        if (window.location.search && (window.location.search.includes('email=') || window.location.search.includes('password='))) {
            // Clear URL parameters immediately to prevent credentials from being exposed
            const cleanPath = window.location.pathname;
            window.history.replaceState({}, document.title, cleanPath);
            
            // Only show warning and auto-fill if this wasn't a form submission
            if (!sessionStorage.getItem('formSubmitted')) {
                showMessage('loginMessage', 'Security Warning: Login credentials should never be passed in URL parameters. Please use the form below.', 'error');
                
                // Auto-fill email from URL parameter if present (but not password)
                if (urlParams.has('email')) {
                    const emailParam = urlParams.get('email');
                    if (emailParam) {
                        const emailInput = document.getElementById('email');
                        if (emailInput) {
                            emailInput.value = decodeURIComponent(emailParam);
                            saveFormData(); // Save the restored data
                        }
                    }
                }
                
                // Clear the password field to prevent auto-submission
                const passwordInput = document.getElementById('password');
                if (passwordInput) {
                    passwordInput.value = '';
                }
            }
        }
        
        // Clear the form submission flag
        sessionStorage.removeItem('formSubmitted');
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            
            // Set form submission flag to prevent security warning on reload
            sessionStorage.setItem('formSubmitted', 'true');
            
            const formData = {
                email: document.getElementById('email').value.trim(), // email OR student ID
                password: document.getElementById('password').value,
                rememberMe: document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false
            };
            
            // SECURITY: Double-check that URL doesn't contain credentials
            // But allow form submissions to proceed
            if (window.location.search && (window.location.search.includes('email=') || window.location.search.includes('password=')) &&
                !sessionStorage.getItem('formSubmitted')) {
                // Clear URL parameters to prevent credentials from being exposed
                window.history.replaceState({}, document.title, window.location.pathname);
                showMessage('loginMessage', 'Security Warning: Login credentials should never be passed in URL parameters.', 'error');
                sessionStorage.removeItem('formSubmitted');
                return;
            }
            
            if (!formData.email || !formData.password) {
                showMessage('loginMessage', 'Please enter both email/student ID and password', 'error');
                sessionStorage.removeItem('formSubmitted');
                return;
            }

            try {
                // Login via backend API (supports both email and student ID)
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email, // Backend handles both email and student ID
                        password: formData.password
                    })
                });

                let data;
                try {
                    data = await response.json();
                } catch (parseError) {
                    throw new Error('Invalid response from server. Please check if the backend is running.');
                }
            
                if (!response.ok) {
                    throw new Error(data.message || `Login failed with status ${response.status}`);
                }

                // Store token and user data in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Clear the form submission flag
                sessionStorage.removeItem('formSubmitted');
                
                // Redirect based on user role
                console.log('Login successful, redirecting user based on role:', data.user.role);
                if (data.user.role === 'admin' || data.user.role === 'sub-admin') {
                    window.location.href = '/pages/admin/';
                } else {
                    window.location.href = '/pages/dashboard/';
                }
            } catch (error) {
                console.error('Login error:', error);
                // Clear the form submission flag on error
                sessionStorage.removeItem('formSubmitted');
                
                let errorMessage = 'Login failed. Please try again.';
                if (error.message && error.message.includes('NetworkError')) {
                    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                showMessage('loginMessage', errorMessage, 'error');
            }
        });
    }
}

// Save form data to localStorage
function saveFormData() {
    // Determine which form we're in
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm && (event && event.target && event.target.closest && event.target.closest('#registerForm'))) {
        const formData = {
            lastName: document.getElementById('lastName')?.value || '',
            firstName: document.getElementById('firstName')?.value || '',
            middleInitial: document.getElementById('middleInitial')?.value || '',
            course: document.getElementById('course')?.value || '',
            year: document.getElementById('year')?.value || '',
            section: document.getElementById('section')?.value || '',
            studentId: document.getElementById('studentId')?.value || '',
            email: document.getElementById('email')?.value || ''
        };
        localStorage.setItem('registerFormData', JSON.stringify(formData));
    } else if (loginForm && (event && event.target && event.target.closest && event.target.closest('#loginForm'))) {
        const formData = {
            email: document.getElementById('email')?.value || '',
            rememberMe: document.getElementById('rememberMe')?.checked || false
        };
        localStorage.setItem('loginFormData', JSON.stringify(formData));
    }
}

// Restore form data from localStorage
function restoreFormData() {
    // Restore register form data
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const savedData = localStorage.getItem('registerFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                document.getElementById('lastName').value = formData.lastName || '';
                document.getElementById('firstName').value = formData.firstName || '';
                document.getElementById('middleInitial').value = formData.middleInitial || '';
                document.getElementById('course').value = formData.course || '';
                document.getElementById('year').value = formData.year || '';
                document.getElementById('section').value = formData.section || '';
                document.getElementById('studentId').value = formData.studentId || '';
                document.getElementById('email').value = formData.email || '';
            
                
                // Handle middle initial toggle state
                const toggleButton = document.getElementById('toggleMiddleInitial');
                if (toggleButton && !formData.middleInitial) {
                    const middleInitialInput = document.getElementById('middleInitial');
                    middleInitialInput.disabled = true;
                    toggleButton.textContent = 'Add Middle Initial';
                    toggleButton.classList.remove('btn-primary');
                    toggleButton.classList.add('btn-secondary');
                }
            } catch (e) {
                console.error('Error restoring register form data:', e);
                localStorage.removeItem('registerFormData');
            }
        }
    }
    
    // Restore login form data
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const savedData = localStorage.getItem('loginFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                document.getElementById('email').value = formData.email || '';
                if (document.getElementById('rememberMe')) {
                    document.getElementById('rememberMe').checked = formData.rememberMe || false;
                }
            } catch (e) {
                console.error('Error restoring login form data:', e);
                localStorage.removeItem('loginFormData');
            }
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

// Show message function
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageEl.className = 'message';
                messageEl.textContent = '';
                messageEl.style.display = 'none';
            }, 5000);
        }
    } else {
        console.error(`Message element not found: ${elementId}`);
    }
}

// Check authentication state
function checkAuthState() {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Checking auth state:', { token, currentPath, userRole: user.role });
    
    // If user is logged in but on auth pages, redirect to appropriate dashboard
    if (token && (currentPath.includes('/auth/login/') || currentPath.includes('/auth/register/'))) {
        console.log('User already logged in, redirecting based on role:', user.role);
        if (user.role === 'admin' || user.role === 'sub-admin') {
            console.log('Redirecting admin to admin panel');
            window.location.href = '/pages/admin/';
        } else {
            console.log('Redirecting to dashboard');
            window.location.href = '/pages/dashboard/';
        }
        return;
    }
    
    // If no token and on protected pages, redirect to login
    if (!token && (currentPath.includes('/pages/dashboard/') || 
                  currentPath.includes('/pages/analytics/') || 
                  currentPath.includes('/pages/voting/') || 
                  currentPath.includes('/pages/notifications/') || 
                  currentPath.includes('/pages/profile/') ||
                  currentPath.includes('/pages/admin/'))) {
        console.log('No token on protected page, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login/';
        return;
    }
    
    // If user is logged in but trying to access admin page without admin role
    if (token && currentPath.includes('/pages/admin/') && user.role !== 'admin' && user.role !== 'sub-admin') {
        console.log('Non-admin user trying to access admin area, redirecting to dashboard');
        window.location.href = '/pages/dashboard/';
    }
}

// Logout function
async function logout() {
    try {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('registerFormData');
        localStorage.removeItem('loginFormData');
        
        // Sign out from Firebase if available
        if (auth && auth.signOut) {
            await auth.signOut();
        }
        
        // Redirect to login page
        window.location.href = '/auth/login/';
    } catch (error) {
        console.error('Logout error:', error);
        // Even if logout fails, clear local data and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('registerFormData');
        localStorage.removeItem('loginFormData');
        window.location.href = '/auth/login/';
    }
}