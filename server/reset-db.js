const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const seedInitialData = require('./src/config/seed');

dotenv.config({ path: path.join(__dirname, '.env') });

const cleanDB = async () => {

  const dataPath = path.join(__dirname, 'data/db.json');
  fs.writeFileSync(dataPath, JSON.stringify({ users: [], appointments: [] }, null, 2));

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/appointment_booking';
  try {
    const conn = await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    const collections = await conn.connection.db.collections();
    for (let c of collections) {
      await c.deleteMany({});
    }
    console.log('[Clean] Wiped old dummy users and appointments from MongoDB collections.');
  } catch (err) {
    console.log('[Clean] MongoDB not active or already wiped:', err.message);
  }

  await seedInitialData();
  console.log('[Clean] Clean state ready with ONLY Chief Hospital Administrator.');
  process.exit(0);
};

cleanDB();

