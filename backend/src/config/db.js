const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripmate';
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // Quick timeout if no local daemon
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Notice] Could not connect to MongoDB at "${uri}": ${error.message}`);
    console.warn(`[TripMate Notice] Seamless in-memory & file-backed fallback storage is active for bookings. To persist to MongoDB Atlas, update MONGODB_URI in backend/.env.`);
    return null;
  }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };
