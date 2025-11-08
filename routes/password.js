const express = require('express');
const Password = require('../models/Password');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new password
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { applicationName, usernameOrEmail, password, websiteUrl } = req.body;

    const newPassword = new Password({
      userId: req.user,
      applicationName,
      usernameOrEmail,
      password,
      websiteUrl
    });

    await newPassword.save();
    res.status(201).json({ message: 'Password saved successfully', password: newPassword });
  } catch (error) {
    console.error('Error saving password:', error);
    res.status(500).json({ message: 'Server error while saving password' });
  }
});

// Get all passwords for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(passwords);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).json({ message: 'Server error while fetching passwords' });
  }
});

// Delete a saved password
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedPassword = await Password.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!deletedPassword) {
      return res.status(404).json({ message: 'Password not found' });
    }
    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    console.error('Error deleting password:', error);
    res.status(500).json({ message: 'Server error while deleting password' });
  }
});

module.exports = router;
