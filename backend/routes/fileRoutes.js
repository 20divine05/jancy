const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadFile,
  getFileInfo,
  verifyPasscode,
  downloadFile,
  getStats,
} = require('../controllers/fileController');

// Upload single file endpoint
router.post('/upload', upload.single('file'), uploadFile);

// Get file metadata endpoint
router.get('/info/:id', getFileInfo);

// Verify passcode endpoint (does not consume download count)
router.post('/verify-passcode/:id', verifyPasscode);

// Download file endpoint
router.post('/download/:id', downloadFile);

// Platform stats endpoint
router.get('/stats', getStats);

module.exports = router;
