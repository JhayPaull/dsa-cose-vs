const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the frontend directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle other routes by serving the appropriate HTML files
app.get('/auth/login/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth/login/index.html'));
});

app.get('/auth/register/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth/register/index.html'));
});

// Routes for Firebase hosting (without /pages/ prefix)
app.get('/dashboard/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/dashboard/index.html'));
});

app.get('/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/admin/index.html'));
});

app.get('/analytics/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/analytics/index.html'));
});

app.get('/profile/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/profile/index.html'));
});

app.get('/voting/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/voting/index.html'));
});

app.get('/notifications/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/notifications/index.html'));
});

// Routes for local development (with /pages/ prefix)
app.get('/pages/dashboard/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/dashboard/index.html'));
});

app.get('/pages/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/admin/index.html'));
});

app.get('/pages/analytics/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/analytics/index.html'));
});

app.get('/pages/profile/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/profile/index.html'));
});

app.get('/pages/voting/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/voting/index.html'));
});

app.get('/pages/notifications/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/notifications/index.html'));
});

// For any other routes, serve index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend development server running at http://localhost:${PORT}`);
  console.log(`You can now edit your frontend files and see changes immediately!`);
});