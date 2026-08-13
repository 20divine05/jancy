const fs = require('fs');
const path = require('path');
const File = require('../models/File');

/**
 * Sweeps the uploads directory and deletes any physical file
 * whose corresponding document in MongoDB has expired or self-destructed.
 */
const cleanupOrphanFiles = async () => {
  const uploadDir = process.env.VERCEL
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '../uploads');

  if (!fs.existsSync(uploadDir)) return;

  try {
    const filesOnDisk = fs.readdirSync(uploadDir);
    if (filesOnDisk.length === 0) return;

    const activeDocs = await File.find({}, 'storagePath');
    const activeStoragePaths = new Set(
      activeDocs.map((doc) => path.resolve(doc.storagePath))
    );

    let deletedCount = 0;
    for (const filename of filesOnDisk) {
      const fullPath = path.resolve(path.join(uploadDir, filename));

      if (!activeStoragePaths.has(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          deletedCount++;
          console.log(`🧹 Cleanup background worker removed orphan disk file: ${filename}`);
        } catch (unlinkErr) {
          console.error(`Failed to unlink orphan file ${filename}:`, unlinkErr);
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`✨ Cleanup background task complete: ${deletedCount} orphan file(s) purged.`);
    }
  } catch (error) {
    console.error('Error during cleanupOrphanFiles:', error);
  }
};

const startCleanupScheduler = (intervalMs = 5 * 60 * 1000) => {
  console.log('🔄 Orphan file background cleanup worker initialized.');
  cleanupOrphanFiles();
  setInterval(cleanupOrphanFiles, intervalMs);
};

module.exports = { cleanupOrphanFiles, startCleanupScheduler };
