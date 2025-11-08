// backend/routes/password.js
const express = require('express');
const router = express.Router();
const Password = require('../models/Password');
const authenticateToken = require('/auth');
const CryptoJS = require('crypto-js');

const CRYPTO_SECRET = process.env.CRYPTO_SECRET || 'change_this_secret';

// Add a new password entry
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { applicationName, usernameOrEmail, password, websiteURL, notes } = req.body;

    if (!applicationName || !usernameOrEmail || !password) {
      return res.status(400).json({ message: 'applicationName, usernameOrEmail and password are required.' });
    }

    // Encrypt password before storing
    const encryptedPassword = CryptoJS.AES.encrypt(password, CRYPTO_SECRET).toString();

    const entry = new Password({
      userId: req.user.userId,
      applicationName,
      usernameOrEmail,
      encryptedPassword,
      websiteURL: websiteURL || '',
      notes: notes || ''
    });

    await entry.save();
    // Do not return decrypted password
    res.status(201).json({
      message: 'Password saved successfully',
      data: {
        id: entry._id,
        applicationName: entry.applicationName,
        usernameOrEmail: entry.usernameOrEmail,
        websiteURL: entry.websiteURL,
        notes: entry.notes,
        createdAt: entry.createdAt
      }
    });
  } catch (err) {
    console.error('Error saving password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all password entries for logged-in user (decrypted)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const entries = await Password.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    const decrypted = entries.map(e => {
      let decryptedPassword = '';
      try {
        decryptedPassword = CryptoJS.AES.decrypt(e.encryptedPassword, CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
      } catch (err) {
        decryptedPassword = ''; // if decryption fails
      }
      return {
        id: e._id,
        applicationName: e.applicationName,
        usernameOrEmail: e.usernameOrEmail,
        password: decryptedPassword, // note: client will receive plain password in response body
        websiteURL: e.websiteURL,
        notes: e.notes,
        createdAt: e.createdAt
      };
    });

    res.json(decrypted);
  } catch (err) {
    console.error('Error fetching passwords:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a password entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await Password.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    await Password.deleteOne({ _id: req.params.id });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('Error deleting password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

