import mongoose from 'mongoose';

export let isUsingMockDb = false;

// Mock database storage in case MongoDB is not running locally
export const mockDb = {
  users: [],
  clubs: [],
  posts: []
};

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clubdb';
  
  try {
    // Set a short timeout (3 seconds) so it fails quickly if Mongo isn't running
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('☘️ MongoDB Connected successfully to:', mongoURI);
  } catch (error) {
    console.error('⚠️ Could not connect to local MongoDB. Error:', error.message);
    console.log('🤖 FALLING BACK TO IN-MEMORY MOCK DATABASE MODE...');
    isUsingMockDb = true;
  }
};
