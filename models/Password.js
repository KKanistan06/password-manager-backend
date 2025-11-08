// backend/models/Password.js
const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationName: {
    type: String,
    required: true,
    trim: true
  },
  usernameOrEmail: {
    type: String,
    required: true,
    trim: true
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  websiteURL: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Password', passwordSchema);
