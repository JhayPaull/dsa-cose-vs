// Slider Routes
const express = require('express');
const router = express.Router();
const dbController = require('../controllers/DatabaseController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the upload directory exists
    const uploadDir = path.join(__dirname, '..', 'uploads', 'slider-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slider-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file && file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Get all slider items
router.get('/', async (req, res) => {
    try {
        const sliderItems = await dbController.getAllSliderItems();
        // Ensure we always return an array
        if (!Array.isArray(sliderItems)) {
            return res.json([]);
        }
        res.json(sliderItems);
    } catch (error) {
        console.error('Error fetching slider items:', error);
        res.status(500).json({ error: 'Failed to fetch slider items' });
    }
});

// Create a new slider item (admin only)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('image'), handleMulterError, async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const createdBy = req.user.id; // Get user ID from auth middleware
        
        // Handle image upload
        let imageUrl = '';
        if (req.file) {
            // Construct URL for the uploaded image
            // Use full URL for Firebase deployment
            const baseUrl = req.get('host');
            const protocol = req.protocol;
            imageUrl = `${protocol}://${baseUrl}/uploads/slider-images/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            // Use provided imageUrl if no file was uploaded
            imageUrl = req.body.imageUrl;
        }
        
        const sliderItemData = {
            title,
            description,
            imageUrl,
            link,
            createdBy
        };
        
        const newSliderItem = await dbController.createSliderItem(sliderItemData);
        res.status(201).json(newSliderItem);
    } catch (error) {
        console.error('Error creating slider item:', error);
        res.status(500).json({ error: error.message || 'Failed to create slider item' });
    }
});

// Update a slider item (admin only)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('image'), handleMulterError, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, link } = req.body;
        
        // Handle image upload
        let imageUrl = '';
        if (req.file) {
            // Construct URL for the uploaded image
            // Use full URL for Firebase deployment
            const baseUrl = req.get('host');
            const protocol = req.protocol;
            imageUrl = `${protocol}://${baseUrl}/uploads/slider-images/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            // Use provided imageUrl if no file was uploaded
            imageUrl = req.body.imageUrl;
        }
        
        const sliderItemData = {
            title,
            description,
            imageUrl,
            link,
            updatedBy: req.user.id
        };
        
        const updatedSliderItem = await dbController.updateSliderItem(id, sliderItemData);
        res.json(updatedSliderItem);
    } catch (error) {
        console.error('Error updating slider item:', error);
        res.status(500).json({ error: error.message || 'Failed to update slider item' });
    }
});

// Delete a slider item (admin only)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await dbController.deleteSliderItem(id);
        res.json({ message: 'Slider item deleted successfully' });
    } catch (error) {
        console.error('Error deleting slider item:', error);
        res.status(500).json({ error: 'Failed to delete slider item' });
    }
});

module.exports = router;