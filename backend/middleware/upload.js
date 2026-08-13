const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Support /tmp directory for Vercel Serverless environment
const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max file size limit
  },
});

module.exports = upload;
