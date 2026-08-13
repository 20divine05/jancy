const File = require('../models/File');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// In-Memory fallback store for when local MongoDB is not running
const memoryStore = new Map();

// Helper to check if Mongoose is connected to a live MongoDB instance
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * POST /api/files/upload
 * Handle single file upload, hash passcode if provided, calculate expiresAt, and save to DB.
 */
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { passcode, maxDownloads = 1, expirationHours = 24 } = req.body;

    const parsedMaxDownloads = Math.max(1, parseInt(maxDownloads, 10) || 1);
    const parsedExpirationHours = Math.max(0.1, parseFloat(expirationHours) || 24);

    // Hash passcode if provided
    let hashedPassword = null;
    if (passcode && passcode.trim().length > 0) {
      hashedPassword = await bcrypt.hash(passcode.trim(), 10);
    }

    // Calculate expiresAt timestamp
    const expiresAt = new Date(Date.now() + parsedExpirationHours * 60 * 60 * 1000);

    let fileId;
    let fileDocData;

    if (isMongoConnected()) {
      // Live MongoDB Mode
      const fileDoc = new File({
        filename: req.file.originalname,
        storagePath: req.file.path,
        fileSize: req.file.size,
        passcode: hashedPassword,
        maxDownloads: parsedMaxDownloads,
        downloadCount: 0,
        expiresAt: expiresAt,
      });

      await fileDoc.save();
      fileId = fileDoc._id.toString();
      fileDocData = fileDoc;
    } else {
      // In-Memory Mode
      fileId = new mongoose.Types.ObjectId().toString();
      fileDocData = {
        _id: fileId,
        filename: req.file.originalname,
        storagePath: req.file.path,
        fileSize: req.file.size,
        passcode: hashedPassword,
        maxDownloads: parsedMaxDownloads,
        downloadCount: 0,
        expiresAt: expiresAt,
        createdAt: new Date(),
      };
      memoryStore.set(fileId, fileDocData);

      // In-Memory TTL timer
      const ttlMs = expiresAt.getTime() - Date.now();
      setTimeout(() => {
        if (memoryStore.has(fileId)) {
          console.log(`⏰ TTL Expired for in-memory file ${fileId}. Self-destructing...`);
          triggerFileSelfDestruct(fileDocData);
        }
      }, Math.max(0, ttlMs));
    }

    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
    const baseUrl = process.env.CLIENT_URL || `${protocol}://${host}`;
    const downloadUrl = `${baseUrl}/download/${fileId}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: fileId,
        filename: fileDocData.filename,
        fileSize: fileDocData.fileSize,
        maxDownloads: fileDocData.maxDownloads,
        downloadCount: fileDocData.downloadCount,
        requiresPasscode: !!fileDocData.passcode,
        expiresAt: fileDocData.expiresAt,
        createdAt: fileDocData.createdAt,
        downloadUrl: downloadUrl,
      },
    });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ success: false, message: 'Server error during upload', error: error.message });
  }
};

/**
 * GET /api/files/info/:id
 * Retrieve metadata for a file without exposing passcode hash or server path.
 */
exports.getFileInfo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    let fileDoc;
    if (isMongoConnected()) {
      fileDoc = await File.findById(id);
    } else {
      fileDoc = memoryStore.get(id);
    }

    if (!fileDoc) {
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    if (new Date() >= new Date(fileDoc.expiresAt) || fileDoc.downloadCount >= fileDoc.maxDownloads) {
      triggerFileSelfDestruct(fileDoc);
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    res.status(200).json({
      success: true,
      file: {
        id: fileDoc._id || id,
        filename: fileDoc.filename,
        fileSize: fileDoc.fileSize,
        maxDownloads: fileDoc.maxDownloads,
        downloadCount: fileDoc.downloadCount,
        remainingDownloads: fileDoc.maxDownloads - fileDoc.downloadCount,
        requiresPasscode: !!fileDoc.passcode,
        expiresAt: fileDoc.expiresAt,
        createdAt: fileDoc.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in getFileInfo:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving file info' });
  }
};

/**
 * POST /api/files/verify-passcode/:id
 * Verify passcode without incrementing download count.
 */
exports.verifyPasscode = async (req, res) => {
  try {
    const { id } = req.params;
    const { passcode } = req.body || {};

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    let fileDoc;
    if (isMongoConnected()) {
      fileDoc = await File.findById(id);
    } else {
      fileDoc = memoryStore.get(id);
    }

    if (!fileDoc) {
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    if (new Date() >= new Date(fileDoc.expiresAt) || fileDoc.downloadCount >= fileDoc.maxDownloads) {
      triggerFileSelfDestruct(fileDoc);
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    if (fileDoc.passcode) {
      if (!passcode) {
        return res.status(401).json({ success: false, message: 'Passcode required' });
      }
      const isMatch = await bcrypt.compare(passcode.trim(), fileDoc.passcode);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect passcode' });
      }
    }

    res.status(200).json({ success: true, message: 'Passcode verified successfully' });
  } catch (error) {
    console.error('Error in verifyPasscode:', error);
    res.status(500).json({ success: false, message: 'Server error verifying passcode' });
  }
};

/**
 * POST /api/files/download/:id
 * Verify passcode (if required), increment download count, stream file, and trigger self-destruct if limit reached.
 */
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { passcode } = req.body || {};

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    let fileDoc;
    if (isMongoConnected()) {
      fileDoc = await File.findById(id);
    } else {
      fileDoc = memoryStore.get(id);
    }

    if (!fileDoc) {
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    if (new Date() >= new Date(fileDoc.expiresAt) || fileDoc.downloadCount >= fileDoc.maxDownloads) {
      triggerFileSelfDestruct(fileDoc);
      return res.status(404).json({ success: false, message: 'Link expired or destroyed' });
    }

    if (fileDoc.passcode) {
      if (!passcode) {
        return res.status(401).json({ success: false, message: 'Passcode required' });
      }
      const isMatch = await bcrypt.compare(passcode.trim(), fileDoc.passcode);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect passcode' });
      }
    }

    if (!fs.existsSync(fileDoc.storagePath)) {
      triggerFileSelfDestruct(fileDoc);
      return res.status(404).json({ success: false, message: 'Physical file no longer exists' });
    }

    let updatedCount;
    if (isMongoConnected()) {
      const updatedDoc = await File.findByIdAndUpdate(
        id,
        { $inc: { downloadCount: 1 } },
        { new: true }
      );
      updatedCount = updatedDoc.downloadCount;
    } else {
      fileDoc.downloadCount += 1;
      updatedCount = fileDoc.downloadCount;
    }

    res.download(fileDoc.storagePath, fileDoc.filename, async (err) => {
      if (err) {
        console.error('Error streaming download:', err);
        if (!res.headersSent) {
          return res.status(500).json({ success: false, message: 'Failed to download file stream' });
        }
      } else {
        console.log(`📥 Transferred "${fileDoc.filename}" (${updatedCount}/${fileDoc.maxDownloads} downloads)`);

        if (updatedCount >= fileDoc.maxDownloads) {
          console.log(`💥 Download limit reached for file ID ${id}. Self-destructing file document and disk file...`);
          await triggerFileSelfDestruct(fileDoc);
        }
      }
    });

  } catch (error) {
    console.error('Error in downloadFile:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error handling download' });
    }
  }
};

/**
 * GET /api/files/stats
 */
exports.getStats = async (req, res) => {
  try {
    let activeFilesCount = 0;
    let totalDownloads = 0;

    if (isMongoConnected()) {
      activeFilesCount = await File.countDocuments({
        expiresAt: { $gt: new Date() },
        $expr: { $lt: ['$downloadCount', '$maxDownloads'] },
      });

      const aggregateResult = await File.aggregate([
        { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
      ]);
      totalDownloads = aggregateResult.length > 0 ? aggregateResult[0].totalDownloads : 0;
    } else {
      memoryStore.forEach((doc) => {
        if (new Date(doc.expiresAt) > new Date() && doc.downloadCount < doc.maxDownloads) {
          activeFilesCount++;
        }
        totalDownloads += doc.downloadCount;
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        activeFiles: activeFilesCount,
        totalDownloads: totalDownloads,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};

/**
 * Helper function to physically delete document and disk file
 */
async function triggerFileSelfDestruct(fileDoc) {
  if (!fileDoc) return;

  const id = fileDoc._id ? fileDoc._id.toString() : fileDoc.id;

  try {
    if (isMongoConnected()) {
      await File.findByIdAndDelete(id);
      console.log(`🗑️ Removed MongoDB record for ${id}`);
    } else {
      memoryStore.delete(id);
      console.log(`🗑️ Removed in-memory record for ${id}`);
    }

    if (fileDoc.storagePath && fs.existsSync(fileDoc.storagePath)) {
      fs.unlink(fileDoc.storagePath, (err) => {
        if (err) console.error(`Failed to delete physical file ${fileDoc.storagePath}:`, err);
        else console.log(`🔥 Physical file deleted from disk: ${fileDoc.storagePath}`);
      });
    }
  } catch (err) {
    console.error('Error during triggerFileSelfDestruct:', err);
  }
}
