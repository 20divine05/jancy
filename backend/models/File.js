const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true,
  },
  storagePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  passcode: {
    type: String,
    default: null,
  },
  maxDownloads: {
    type: Number,
    default: 1,
    min: 1,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// CRITICAL: MongoDB TTL index for automatic document expiration
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('File', fileSchema);
