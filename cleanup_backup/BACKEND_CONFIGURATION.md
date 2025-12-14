# Backend Configuration Guide

This guide explains how to properly configure the backend URL for the E-Voting System.

## Understanding the Issue

The error message "Cannot connect to server. Please ensure the backend is running on https://dsa-cose-vs-backend.example.com/api" appears when the frontend cannot communicate with the backend server. This typically happens when:

1. The backend server is not running
2. The backend URL is incorrectly configured
3. There are network connectivity issues
4. CORS settings are not properly configured

## How the System Determines the Backend URL

The frontend determines the backend URL using the following logic in `frontend/js/api-config.js`:

1. **Custom URL**: If a `backend_url` is set in localStorage, that value is used
2. **Environment Variable**: If running in a Docker container with `API_BASE_URL` environment variable, that value is used
3. **Production Hosting**: If hosted on Firebase (`dsa-cose-vs.web.app` or `dsa-cose-vs.firebaseapp.com`), a placeholder URL is used
4. **Local Development**: For localhost environments, `http://localhost:3001/api` is used
5. **Fallback**: Defaults to `http://localhost:3001/api`

## Solutions

### Solution 1: Using the Configuration Page (Recommended)

We've created a simple configuration page at `/configure-backend.html` that allows you to:

1. Set a custom backend URL
2. Test the connection to your backend
3. Clear custom settings to use defaults

To use it:
1. Open your browser and navigate to `/configure-backend.html`
2. Enter your backend URL (without `/api` - it will be added automatically)
3. Click "Save Backend URL"
4. Test the connection using the "Test Connection to Backend" button

### Solution 2: Setting localStorage Manually

You can manually set the backend URL using your browser's developer tools:

1. Open your browser's developer console (usually F12)
2. Run the following command:
   ```javascript
   localStorage.setItem('backend_url', 'https://your-production-backend-url.com');
   ```
3. Refresh the page

### Solution 3: Modifying the Source Code

You can directly modify `frontend/js/api-config.js`:

1. Open `frontend/js/api-config.js`
2. Find the section for production hosting (around line 24)
3. Replace the placeholder URL with your actual backend URL:
   ```javascript
   // For production Firebase Hosting
   return 'https://your-actual-backend-url.com/api';
   ```

## Deploying to Production

When deploying to production, you'll need to:

1. Deploy your backend to a cloud service (Google Cloud Run, AWS, etc.)
2. Update the backend URL in one of the ways described above
3. Ensure CORS is properly configured in your backend (`backend/server.js`)

### Example for Google Cloud Run

If you deploy to Google Cloud Run, your backend URL might look like:
```
https://evoting-backend-xxxxxx-uc.a.run.app
```

In this case, you would set:
```javascript
localStorage.setItem('backend_url', 'https://evoting-backend-xxxxxx-uc.a.run.app');
```

## Testing Your Configuration

After configuring your backend URL:

1. Open the configuration page and click "Test Connection to Backend"
2. Or manually test by visiting `/test-api.html` in your browser
3. Or check the browser console for any connection errors

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend's CORS settings in `backend/server.js` include your frontend URL
2. **HTTPS/HTTP Mismatch**: Make sure both frontend and backend use the same protocol
3. **Firewall Issues**: Ensure your backend is accessible from the internet if hosting frontend publicly

### Checking Backend Health

You can check if your backend is running by visiting:
```
[your-backend-url]/api/health
```

This should return a JSON response with status information.

## Need Help?

If you continue to have issues:

1. Check the browser console for detailed error messages
2. Verify your backend is running and accessible
3. Confirm CORS settings include your frontend URL
4. Contact the development team for assistance