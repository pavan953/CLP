const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const defaultData = {
  users: [],
  appointments: []
};

const localDataDir = path.join(__dirname, '../../data');
const localDataFilePath = path.join(localDataDir, 'db.json');

const isProductionEnvironment = () => {
  return process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
};

try {
  if (!isProductionEnvironment()) {
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    if (!fs.existsSync(localDataFilePath)) {
      fs.writeFileSync(localDataFilePath, JSON.stringify(defaultData, null, 2));
    }
  }
} catch (err) {
}

let inMemoryCache = null;

const readData = () => {
  if (isProductionEnvironment()) {
    return { users: [], appointments: [] };
  }
  try {
    if (fs.existsSync(localDataFilePath)) {
      const raw = fs.readFileSync(localDataFilePath, 'utf8');
      inMemoryCache = JSON.parse(raw);
      return inMemoryCache;
    }
    return inMemoryCache || { users: [], appointments: [] };
  } catch (err) {
    return inMemoryCache || { users: [], appointments: [] };
  }
};

const writeData = (data) => {
  if (isProductionEnvironment()) {
    return;
  }
  inMemoryCache = data;
  try {
    fs.writeFileSync(localDataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
  }
};

const connectDB = async () => {
  const isProd = isProductionEnvironment();
  const mongoURI = process.env.MONGODB_URI;

  if (isProd && !mongoURI) {
    throw new Error('MONGODB_URI environment variable is required in production.');
  }

  const targetURI = mongoURI || 'mongodb://127.0.0.1:27017/appointment_booking';

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    const options = {
      bufferCommands: false,
      serverSelectionTimeoutMS: isProd ? 5000 : 2000
    };
    cached.promise = mongoose.connect(targetURI, options).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected successfully: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    if (isProd) {
      throw new Error(`MongoDB connection failed in production: ${err.message}`);
    }
    console.warn(`[Storage] Local MongoDB offline (${err.message}). Using local file store.`);
  }
};

const getStatus = () => {
  const isConnected = mongoose.connection.readyState === 1;
  return {
    isMongoConnected: isConnected,
    persistenceMode: isConnected ? 'MongoDB' : 'Persistent File Store'
  };
};

module.exports = {
  connectDB,
  getStatus,
  readData,
  writeData
};

