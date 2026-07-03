const express = require('express');
const router = express.Router();

// Microsoft sends a notification when a new user is created
router.post('/webhook/user-created', async (req, res) => {
  try {
    const microsoftUser = req.body;
    
    console.log('📥 Microsoft user created:', microsoftUser);
    
    // Check if user already exists in your database
    const existingUser = await User.findOne({ email: microsoftUser.email });
    
    if (!existingUser) {
      // Create a pending user record in your platform
      const newUser = await User.create({
        microsoftId: microsoftUser.id,
        email: microsoftUser.email,
        firstName: microsoftUser.givenName,
        lastName: microsoftUser.surname,
        status: 'pending', // Needs role assignment
        source: 'microsoft-365'
      });
      
      console.log('✅ User synced to platform:', newUser._id);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all pending users (created in Microsoft but not yet assigned role)
router.get('/pending-users', authenticateToken, async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      status: 'pending',
      source: 'microsoft-365' 
    });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign role to synced Microsoft user
router.post('/assign-role', authenticateToken, async (req, res) => {
  try {
    const { userId, role, jobPosition } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        role, 
        jobPosition,
        status: 'active' 
      },
      { new: true }
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});