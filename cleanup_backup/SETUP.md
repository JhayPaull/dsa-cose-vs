# Setup Guide - TCC E-Voting System

## Quick Start Guide

### Step 1: Database Setup

1. Install MySQL if you haven't already
2. Create the database:
```sql
CREATE DATABASE tcc_evoting;
```

### Step 2: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tcc_evoting
PORT=3000
JWT_SECRET=tcc_evoting_secret_key_2024_change_in_production
```

4. Start the backend server:
```bash
npm start
```

The backend will automatically create all necessary database tables on first run.

### Step 3: Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Start a local server (choose one method):

**Option A: Using Python**
```bash
python -m http.server 8000
```

**Option B: Using Node.js http-server**
```bash
npm install -g http-server
http-server -p 8000
```

**Option C: Using PHP**
```bash
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

### Step 4: First User Registration

1. Click "Register" on the homepage
2. Fill in the registration form:
   - Full Name
   - Student ID
   - Email
   - Password (minimum 6 characters)
   - Role (Voter or Admin)
3. Click "Register"
4. You'll be redirected to the login page
5. Login with your credentials

## Testing the System

### Create Test Data (Optional)

You can manually insert test data into the database:

```sql
-- Insert a test election
INSERT INTO elections (title, description, start_date, end_date, status) 
VALUES ('Student Council Election 2024', 'Annual student council election', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'active');

-- Insert test candidates (replace election_id with actual ID)
INSERT INTO candidates (election_id, name, position, party) VALUES
(1, 'John Doe', 'President', 'Independent'),
(1, 'Jane Smith', 'President', 'Progressive Party'),
(1, 'Bob Johnson', 'Vice President', 'Independent');
```

## Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env` file
- Ensure port 3000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check browser console for CORS errors
- Ensure API_BASE_URL in JavaScript files matches your backend URL

### Database connection errors
- Verify MySQL is installed and running
- Check database credentials
- Ensure database `tcc_evoting` exists

## Development Mode

For development with auto-reload:

```bash
cd backend
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Production Deployment

For production:
1. Change JWT_SECRET to a strong random string
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Configure proper CORS settings
5. Use a production database
6. Set up proper logging and monitoring

