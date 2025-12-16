# Network Access Troubleshooting Guide

If you're unable to access the E-Voting system from other devices, follow these troubleshooting steps:

## 1. Verify Docker Containers Are Running

Check that both containers are up and healthy:
```bash
docker-compose ps
```

You should see both `evoting-backend` and `evoting-frontend` with a status of "Up".

## 2. Test Local Access

Verify you can access the services locally:

**Backend Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Frontend:**
```bash
curl -UseBasicParsing http://localhost:8081
```

## 3. Check Your IP Address

Find your computer's IP address:
```cmd
ipconfig | findstr IPv4
```

Look for the IPv4 address that corresponds to your local network (usually something like 192.168.x.x or 10.x.x.x).

## 4. Open Firewall Ports

Windows Firewall may be blocking access to the ports. Run the provided scripts as Administrator:

1. Right-click on `OPEN_PORTS_FOR_NETWORK_ACCESS.bat`
2. Select "Run as administrator"

This will open ports 3001 (backend) and 8081 (frontend) in the Windows Firewall.

## 5. Test Network Access

From another device on the same network, try accessing:

- Frontend: http://YOUR_IP_ADDRESS:8081
- Backend Health Check: http://YOUR_IP_ADDRESS:3001/api/health

Replace YOUR_IP_ADDRESS with the IP address you found in step 3.

## 6. Common Issues and Solutions

### Issue: Cannot access from other devices
**Solution:** 
1. Ensure Windows Firewall is not blocking the ports
2. Check that all devices are on the same network
3. Some networks (especially public Wi-Fi) restrict device-to-device communication

### Issue: Timeout when accessing from other devices
**Solution:**
1. Verify the IP address is correct
2. Confirm the Docker containers are running
3. Check if antivirus software is blocking the connections

### Issue: Connection refused
**Solution:**
1. Make sure you're using the correct port numbers (3001 for backend, 8081 for frontend)
2. Verify that the services are actually listening on all interfaces (0.0.0.0)

## 7. Advanced Troubleshooting

### Check what interfaces the services are bound to:
```bash
docker-compose exec backend netstat -tuln
```

### View container logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Test connectivity from within the container:
```bash
docker-compose exec backend curl http://localhost:3001/api/health
```

## 8. Network Configuration Details

The system is configured to:
- Bind the backend to all interfaces (0.0.0.0) on port 3001
- Map container port 3001 to host port 3001
- Bind the frontend to all interfaces (0.0.0.0) on port 8080
- Map container port 8080 to host port 8081

## 9. Security Considerations

When opening your development server to the network:
1. Only do this on trusted networks
2. Be aware that you're exposing your development environment
3. Don't leave network access enabled when not needed