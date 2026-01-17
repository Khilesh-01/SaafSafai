const express = require('express');
const router = express.Router();
const {
  getUserByClerkId,
  updateUserProfile,
  createOrUpdateUserProfile,
  getAllUsers,
  uploadProfilePicture
} = require('../controllers/profileControllers.js');
const upload = require('../middlewares/upload');
const User = require('../models/userModel');

// Get user profile by Clerk ID
router.get('/:clerkUserId', getUserByClerkId);

// Get user profile by regular ID (for admin system)
router.get('/id/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      profilePictureUrl: user.profilePictureUrl || null,
      isProfileComplete: user.isProfileComplete()
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all users (admin only)
router.get('/', require('../middlewares/validate').verifyToken, require('../middlewares/validate').isAdmin, getAllUsers);

// Update user profile
router.put('/:clerkUserId', updateUserProfile);

// Create or update user profile (for Clerk integration)
router.post('/create-or-update', createOrUpdateUserProfile);

// Promote user to admin (admin only)
router.patch('/:userId/promote', require('../middlewares/validate').verifyToken, require('../middlewares/validate').isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Try to find by Clerk ID first, then by regular MongoDB ID
    let user = await User.findByClerkId(userId);
    if (!user) {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin successfully', user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

// Upload optional profile picture
router.post('/:clerkUserId/profile-picture', upload.single('image'), uploadProfilePicture);

module.exports = router;
