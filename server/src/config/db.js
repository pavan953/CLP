const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

const dataDir = path.join(__dirname, '../../data');
const dataFilePath = path.join(dataDir, 'db.json');

// Initialize data folder & file if not exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultData = {
  users: [],
  appointments: []
};

if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
}

// Persistent File Store Helpers
const readData = () => {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading persistent data store:', err);
    return { users: [], appointments: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to persistent data store:', err);
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
    console.log(`[Storage] Using resilient persistent disk store at: ${dataFilePath}`);
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
