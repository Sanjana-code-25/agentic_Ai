const mongoose = require('mongoose');

let memoryServer = null;

const sanitizeMongoUri = () => {
  const rawUri = (process.env.MONGO_URI || '').trim();

  if (!rawUri || rawUri.includes('<') || rawUri.includes('>')) {
    return 'mongodb://127.0.0.1:27017/college-complaint-db';
  }

  const isValidUri = rawUri.startsWith('mongodb://') || rawUri.startsWith('mongodb+srv://');
  return isValidUri ? rawUri : 'mongodb://127.0.0.1:27017/college-complaint-db';
};

const connectDB = async () => {
  const primaryUri = sanitizeMongoUri();

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB] Primary connection to ${primaryUri} failed: ${error.message}`);
    console.log('[MongoDB] Attempting in-memory MongoDB fallback for seamless local development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] In-Memory MongoDB Server running at ${memUri}`);
    } catch (memError) {
      console.error('[MongoDB] In-memory server fallback error:', memError.message);
      console.error('[MongoDB] Please ensure MongoDB is running locally or specify a valid MONGO_URI in server/.env');
      throw error;
    }
  }
};

module.exports = connectDB;
