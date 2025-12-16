# Accessing the E-Voting System from Other Devices

This document explains how to access the E-Voting system from other devices on the same network when running with Docker.

## Changes Made

1. **Updated docker-compose.yml**:
   - Added `HOST=0.0.0.0` environment variable to ensure the backend binds to all interfaces

2. **Updated backend/Dockerfile**:
   - Clarified that the container binds to all interfaces

3. **Updated backend/server.js**:
   - Explicitly configured the server to bind to `0.0.0.0` by default
   - Added support for `HOST` environment variable

4. **Created RUN_DOCKER_ACCESSIBLE.bat**:
   - Simple script to start Docker containers and provide instructions for accessing from other devices

5. **Updated Documentation**:
   - README.md
   - cleanup_backup/QUICK_DOCKER_START.md
   - cleanup_backup/DOCKER_DEPLOYMENT_GUIDE.md

## How to Access from Other Devices

### Step 1: Start the Docker Containers
```bash
docker-compose up -d
```

Or use the provided script:
```batch
RUN_DOCKER_ACCESSIBLE.bat
```

### Step 2: Find Your Computer's IP Address

**Windows:**
1. Open Command Prompt
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your active network connection

**macOS/Linux:**
1. Open Terminal
2. Run: `ifconfig` or `ip addr`
3. Look for your network interface's IP address

### Step 3: Access from Other Devices

Replace `YOUR_COMPUTER_IP` with the IP address found in Step 2:

- **Frontend (Website)**: http://YOUR_COMPUTER_IP:8081
- **Backend API**: http://YOUR_COMPUTER_IP:3001/api
- **Backend Health Check**: http://YOUR_COMPUTER_IP:3001/api/health

**Example:**
If your computer's IP is 192.168.1.100:
- Frontend: http://192.168.1.100:8081
- Backend API: http://192.168.1.100:3001/api
- Backend Health Check: http://192.168.1.100:3001/api/health

## Troubleshooting

1. **Can't access from other devices:**
   - Ensure Windows Firewall isn't blocking the ports
   - Check if your antivirus software is blocking the connections
   - Verify the Docker containers are running: `docker-compose ps`

2. **Port conflicts:**
   - If ports 3001 or 8081 are already in use, change them in `docker-compose.yml`

3. **Network issues:**
   - Ensure all devices are on the same network
   - Some networks may restrict device-to-device communication

## Security Note

When accessing the system from other devices, you're exposing your development server to the local network. For production use, ensure proper security measures are in place.