# Troubleshooting Guide

## Common Issues and Solutions

### 1. Can't Login or Register

**Problem**: Login/Register forms don't work, nothing happens when you submit.

**Solutions**:

1. **Check if Backend is Running**:
   ```bash
   # Check if backend is running on port 3001
   curl http://localhost:3001/api/health
   ```
   
   If you get an error, start the backend:
   ```bash
   cd backend
   npm start
   ```

2. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Check Network tab to see if API calls are failing

3. **Verify API URL**:
   - Open browser console
   - Type: `window.API_BASE_URL`
   - Should show: `http://localhost:3001/api`
   - If wrong, check `frontend/js/api-config.js`

4. **Check CORS Settings**:
   - Backend must allow requests from your frontend URL
   - Check `backend/server.js` CORS configuration

### 2. CSS/Styling Issues

**Problem**: Styles don't fit, layout is broken, can't scroll.

**Solutions**:

1. **Clear Browser Cache**:
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Clear cached images and files
   - Reload page (Ctrl+F5 or Cmd+Shift+R)

2. **Check CSS File Loading**:
   - Open DevTools → Network tab
   - Reload page
   - Look for `style.css` - should load with status 200
   - If 404, check file path in HTML

3. **Verify Viewport Meta Tag**:
   - Should be in `<head>`: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### 3. Docker Issues

**Problem**: Docker containers not working or interfering.

**Solutions**:

1. **Stop Docker Containers** (if interfering with local development):
   ```bash
   docker-compose down
   ```

2. **Check Docker Status**:
   ```bash
   docker-compose ps
   ```

3. **View Docker Logs**:
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

4. **Restart Docker Containers**:
   ```bash
   docker-compose restart
   ```

### 4. Register Form Issues

**Problem**: Register form doesn't submit or has styling issues.

**Solutions**:

1. **Check Form Validation**:
   - All required fields must be filled
   - Student ID must be numeric only
   - Password must be at least 6 characters
   - Passwords must match

2. **Check Console for Errors**:
   - Open DevTools → Console
   - Look for JavaScript errors
   - Check if `auth.js` is loading

3. **Verify API Connection**:
   - Check Network tab in DevTools
   - Look for POST request to `/api/auth/register`
   - Check response status and message

### 5. Backend Connection Issues

**Problem**: Frontend can't connect to backend.

**Solutions**:

1. **Verify Backend is Running**:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Linux/Mac
   lsof -i :3001
   ```

2. **Check Backend Health**:
   ```bash
   curl http://localhost:3001/api/health
   ```
   
   Should return: `{"status":"OK","message":"TCC E-Voting API is running"}`

3. **Check Firestore Connection**:
   - Look at backend console logs
   - Should see: `✓ Firebase Admin SDK initialized successfully`
   - If error, check `serviceAccountKey.json` file

4. **Verify CORS**:
   - Backend must allow your frontend origin
   - Check `backend/server.js` allowed origins list

### 6. Firebase Hosting Issues

**Problem**: Deployed site doesn't work.

**Solutions**:

1. **Set Backend URL**:
   - Open browser console on deployed site
   - Run: `localStorage.setItem('backend_url', 'https://your-backend-url.com')`
   - Refresh page

2. **Check Backend Deployment**:
   - Backend must be deployed and accessible
   - Update `frontend/js/api-config.js` with production URL

3. **Verify Firebase Config**:
   - Check Firebase project ID matches
   - Verify service account key has proper permissions

## Quick Diagnostic Commands

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check if port is in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# View backend logs
cd backend
npm start

# Check Docker containers
docker-compose ps
docker-compose logs

# Test API directly
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Still Having Issues?

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API requests
3. **Check Backend Logs** for server errors
4. **Verify All Files Are Saved** and reloaded
5. **Clear Browser Cache** and try again
6. **Check File Paths** - ensure all paths are correct (use `/` for root)

## Getting Help

When reporting issues, include:
- Browser console errors
- Network tab errors
- Backend logs
- Steps to reproduce
- Expected vs actual behavior

