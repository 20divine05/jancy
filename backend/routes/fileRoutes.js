const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadFile,
  getFileInfo,
  downloadFile,
  getStats,
} = require('../controllers/fileController');

// Upload single file endpoint
router.post('/upload', upload.single('file'), uploadFile);

// Get file metadata endpoint
router.get('/info/:id', getFileInfo);

// Download file endpoint
router.post('/download/:id', downloadFile);

// Platform stats endpoint
router.get('/stats', getStats);

module.exports = router;
