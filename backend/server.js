const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const { startCleanupScheduler } = require('./utils/cleanup');

const app = express();
const PORT = process.env.PORT || 5000;

// Express middleware configuration

// CORS Configuration (Allow frontend access)
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Express Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'DropShield Backend API',
    timestamp: new Date(),
  });
});

// Redirect direct browser visits from backend port 5000 /download/:id to frontend port 5173 /download/:id
app.get('/download/:id', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${clientUrl}/download/${req.params.id}`);
});

// Register File API Routes
app.use('/api/files', fileRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Express Error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds maximum allowed limit (100MB)',
    });
  }
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server after DB connection is initialized
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🛡️  DropShield Backend Server running on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/files`);
      console.log(`====================================================`);

      // Start background periodic orphan physical file sweeper
      startCleanupScheduler(5 * 60 * 1000); // Sweep every 5 minutes
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
