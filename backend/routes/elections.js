const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const ElectionController = require('../controllers/ElectionController');
const DatabaseController = require('../controllers/DatabaseController');

const router = express.Router();

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}

// Create a new election (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const electionData = {
            ...req.body,
            createdBy: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Validate required fields
        if (!electionData.title || !electionData.startDate || !electionData.endDate || !electionData.position) {
            return res.status(400).json({ 
                message: 'Title, start date, end date, and position are required' 
            });
        }

        // Validate date logic
        const startDate = new Date(electionData.startDate);
        const endDate = new Date(electionData.endDate);
        
        if (startDate >= endDate) {
            return res.status(400).json({ 
                message: 'End date must be after start date' 
            });
        }

        // Set default status to draft if not provided
        if (!electionData.status) {
            electionData.status = 'draft';
        }

        // Create the election
        const createdElection = await ElectionController.createElection(electionData);
        
        // If candidates were provided, create them
        if (electionData.candidates && Array.isArray(electionData.candidates)) {
            for (const candidate of electionData.candidates) {
                const candidateData = {
                    electionId: createdElection.id,
                    name: candidate.name,
                    position: electionData.position,
                    party: candidate.party || '',
                    bio: candidate.bio || '',
                    votes: 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                await DatabaseController.createCandidate(candidateData);
            }
        }

        res.status(201).json({ 
            message: 'Election created successfully',
            election: createdElection
        });
    } catch (error) {
        console.error('Create election error:', error);
        res.status(500).json({ 
            message: 'Server error during election creation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all elections (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const elections = await ElectionController.getAllElections();
        res.json({ elections });
    } catch (error) {
        console.error('Get elections error:', error);
        res.status(500).json({ 
            message: 'Server error retrieving elections',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get election by ID (admin only)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const election = await ElectionController.getElectionById(id);
        
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        
        res.json({ election });
    } catch (error) {
        console.error('Get election error:', error);
        res.status(500).json({ 
            message: 'Server error retrieving election',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Update election (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const electionData = {
            ...req.body,
            updatedAt: new Date()
        };

        // Validate date logic if dates are provided
        if (electionData.startDate && electionData.endDate) {
            const startDate = new Date(electionData.startDate);
            const endDate = new Date(electionData.endDate);
            
            if (startDate >= endDate) {
                return res.status(400).json({ 
                    message: 'End date must be after start date' 
                });
            }
        }

        const updatedElection = await ElectionController.updateElection(id, electionData);
        
        res.json({ 
            message: 'Election updated successfully',
            election: updatedElection
        });
    } catch (error) {
        console.error('Update election error:', error);
        res.status(500).json({ 
            message: 'Server error updating election',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete election (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if election exists
        const election = await ElectionController.getElectionById(id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        
        // Delete the election
        await ElectionController.deleteElection(id);
        
        res.json({ message: 'Election deleted successfully' });
    } catch (error) {
        console.error('Delete election error:', error);
        res.status(500).json({ 
            message: 'Server error deleting election',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Set election status (admin only)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const updatedElection = await ElectionController.setElectionStatus(id, status);
        
        res.json({ 
            message: `Election status updated to ${status}`,
            election: updatedElection
        });
    } catch (error) {
        console.error('Set election status error:', error);
        res.status(500).json({ 
            message: 'Server error updating election status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get election results (admin only)
router.get('/:id/results', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get election results
        const results = await ElectionController.getElectionResults(id);
        
        res.json(results);
    } catch (error) {
        console.error('Get election results error:', error);
        res.status(500).json({ 
            message: 'Server error retrieving election results',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;