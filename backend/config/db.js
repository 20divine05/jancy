const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dropshield';
  console.log(`📡 Connecting to MongoDB at: ${mongoUri}`);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB server successfully.');
  } catch (err) {
    console.warn(`⚠️ Primary MongoDB unavailable (${err.message}). Switching to In-Memory Smart Data Store for instant execution.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;
