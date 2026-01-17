const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  phone:String,
  email: String,
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Pending'
  },
  notifyByEmail: {
    type: Boolean,
    default: false, // Default to false if not specified
  },
});

module.exports = mongoose.model('Issue', issueSchema);
