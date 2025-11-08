const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationName: {
    type: String,
    required: true
  },
  usernameOrEmail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  websiteUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Password', passwordSchema);
