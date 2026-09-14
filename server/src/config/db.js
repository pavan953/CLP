const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

const defaultData = {
  users: [],
  appointments: []
};

const localDataDir = path.join(__dirname, '../../data');
const localDataFilePath = path.join(localDataDir, 'db.json');
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const tmpFilePath = '/tmp/clp_db.json';

const getActiveDataFilePath = () => {
  if (isServerless) {
    if (!fs.existsSync(tmpFilePath)) {
      try {
        if (fs.existsSync(localDataFilePath)) {
          const initial = fs.readFileSync(localDataFilePath, 'utf8');
          fs.writeFileSync(tmpFilePath, initial);
        } else {
          fs.writeFileSync(tmpFilePath, JSON.stringify(defaultData, null, 2));
        }
      } catch (err) {
        return localDataFilePath;
      }
    }
    return tmpFilePath;
  }
  return localDataFilePath;
};

try {
  if (!isServerless && !fs.existsSync(localDataDir)) {
    fs.mkdirSync(localDataDir, { recursive: true });
  }
  if (!isServerless && !fs.existsSync(localDataFilePath)) {
    fs.writeFileSync(localDataFilePath, JSON.stringify(defaultData, null, 2));
  }
} catch (err) {
}

let inMemoryCache = null;

const readData = () => {
  try {
    const targetPath = getActiveDataFilePath();
    if (fs.existsSync(targetPath)) {
      const raw = fs.readFileSync(targetPath, 'utf8');
      inMemoryCache = JSON.parse(raw);
      return inMemoryCache;
    }
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
  inMemoryCache = data;
  try {
    const targetPath = getActiveDataFilePath();
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
  } catch (err) {
    try {
      fs.writeFileSync(tmpFilePath, JSON.stringify(data, null, 2));
    } catch (e) {
    }
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/appointment_booking';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Storage] MongoDB server not reachable at ${mongoURI} (${err.message}).`);
    console.log(`[Storage] Using resilient persistent disk store at: ${getActiveDataFilePath()}`);
    console.log(`[Storage] Appointments and user data will persist permanently across refreshes and restarts!`);
  }
};

const getStatus = () => ({
  isMongoConnected,
  persistenceMode: isMongoConnected ? 'MongoDB' : 'Persistent File Store'
});

module.exports = {
  connectDB,
  getStatus,
  readData,
  writeData
};

