# Frontend Development Guide

This guide explains how to set up a local development environment for editing the frontend of the E-Voting System with live reloading capabilities.

## Prerequisites

- Node.js v14+ installed on your system
- Internet connection (for initial setup)

## Starting the Development Server

### Option 1: Using the New Development Script (Recommended)

For Windows Command Prompt:
1. Double-click on `START_FRONTEND_DEV.bat` in the project root directory

For PowerShell:
1. Right-click on `START_FRONTEND_DEV.ps1` in the project root directory
2. Select "Run with PowerShell"

Both scripts will:
   - Check if Node.js is installed
   - Install `live-server` if not already present
   - Start a development server with live reloading on `http://localhost:8080`
### Option 2: Using Built-in npm Scripts

1. Open a terminal/command prompt
2. Navigate to the project root directory
3. Run one of these commands:
   ```
   npm run serve
   # or
   npm run dev
   ```
4. Access the frontend at `http://localhost:8080`

### Option 3: Using the Existing Server Script

1. Double-click on `START_FRONTEND.bat` in the project root directory
2. Access the frontend at `http://localhost:8000`
3. Note: This option requires manual browser refresh after changes

## Features of the Development Server

- **Live Reloading**: Automatically refreshes the browser when you save changes to HTML, CSS, or JavaScript files
- **Static File Serving**: Properly serves all static assets (images, CSS, JS)
- **Route Handling**: Supports all frontend routes (login, register, dashboard, etc.)

## Editing Files

All frontend files are located in the `frontend/` directory:
- Main landing page: `frontend/index.html`
- CSS styles: `frontend/css/`
- JavaScript files: `frontend/js/`
- Component pages: `frontend/auth/`, `frontend/dashboard/`, etc.

## Tips for Development

1. **Real-time Preview**: With the live-server option, any changes you save will immediately appear in your browser
2. **Console Logs**: Check the terminal window for server logs and error messages
3. **Network Requests**: Browser developer tools can help debug API calls to the backend

## Stopping the Server

Press `Ctrl+C` in the terminal/command prompt window to stop the development server.

## Troubleshooting

If you encounter issues:

1. **Port Conflicts**: If port 8080 is busy, the server will automatically try another port
2. **Permission Errors**: On some systems, you may need to run the script as administrator
3. **Missing Dependencies**: The script will attempt to install required packages automatically

For more detailed deployment instructions, refer to `QUICK_START.md` or `README.md`.