# Image Upload Functionality for Slider Items

This document explains how the image upload functionality works for slider items in the E-Voting System.

## How It Works

1. **Frontend (Edit Slider Page)**:
   - Users select an image file through the file input
   - The image is uploaded along with slider item data using FormData
   - The request is sent to the backend API endpoint `/api/slider`

2. **Backend (Node.js/Express)**:
   - Uses Multer middleware to handle file uploads
   - Stores images in `backend/uploads/slider-images/` directory
   - Generates unique filenames to prevent conflicts
   - Saves image metadata (URL path) in the database

3. **Docker Integration**:
   - Volume mapping ensures uploaded images persist across container restarts
   - Images are served statically through the backend server

## Technical Details

### File Storage Location
- Local development: `backend/uploads/slider-images/`
- Docker containers: `/app/uploads/slider-images/` (mapped to host directory)

### URL Structure
- Uploaded images are accessible at: `http://your-domain/uploads/slider-images/filename.jpg`

### File Restrictions
- Maximum file size: 5MB
- Allowed file types: JPEG, PNG, GIF, WEBP
- Files are renamed with unique identifiers to prevent conflicts

## Docker Configuration

The `docker-compose.yml` file includes volume mapping to ensure uploaded images persist:

```yaml
volumes:
  - ./backend/uploads:/app/uploads
```

This maps the host's `backend/uploads` directory to the container's `/app/uploads` directory.

## Security Considerations

1. File type validation prevents malicious file uploads
2. File size limits prevent denial-of-service attacks
3. Unique filenames prevent path traversal attacks
4. Files are stored outside the web root with controlled access

## Troubleshooting

### Images Not Appearing
1. Check that the Docker volume mapping is correct
2. Verify file permissions on the uploads directory
3. Ensure the backend server is properly serving static files

### Upload Failures
1. Check file size limits (max 5MB)
2. Verify file type is an image (JPEG, PNG, GIF, WEBP)
3. Confirm the backend service is running and accessible

## Maintenance

### Cleaning Up Old Images
To remove unused images:
```bash
# On the host system
find backend/uploads/slider-images -type f -mtime +30 -delete
```

### Backup Strategy
Include the `backend/uploads` directory in regular backups to preserve uploaded images.