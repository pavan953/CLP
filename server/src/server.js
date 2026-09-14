const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const { connectDB, getStatus } = require('./config/db');
const seedInitialData = require('./config/seed');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB and initialize data
let initializationPromise;

const initializeDatabase = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await connectDB();
      await seedInitialData();
    })();
  }

  return initializationPromise;
};

// Initialize database before handling API requests
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (err) {
    console.error('Database initialization error:', err);
    res.status(500).json({
      success: false,
      message: 'Database initialization failed'
    });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/api/health', (req, res) => {
  const status = getStatus();

  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: status.persistenceMode,
    isMongoConnected: status.isMongoConnected
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;