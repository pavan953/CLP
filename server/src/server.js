const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const { connectDB, getStatus } = require('./config/db');
const seedInitialData = require('./config/seed');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !process.env.FRONTEND_URL || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

let initializationPromise;

const initializeDatabase = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await connectDB();
      await seedInitialData();
    })().catch((err) => {
      initializationPromise = null;
      throw err;
    });
  }

  return initializationPromise;
};

app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (err) {
    console.error('Database initialization error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Database initialization failed',
      error: process.env.NODE_ENV === 'production' ? 'Database connection unavailable' : err.message
    });
  }
});

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/appointments', appointmentRoutes);
app.use('/appointments', appointmentRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

const handleHealth = (req, res) => {
  const status = getStatus();

  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: status.persistenceMode,
    isMongoConnected: status.isMongoConnected
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Clinic Living Plus API',
    health: '/api/health'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (require.main === module && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`Clinic Living Plus API Server running on port ${PORT}`);
  });
}

module.exports = app;