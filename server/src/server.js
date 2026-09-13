const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getStatus } = require('./config/db');
const seedInitialData = require('./config/seed');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health & Status Check
app.get('/api/health', (req, res) => {
  const status = getStatus();
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: status.persistenceMode,
    isMongoConnected: status.isMongoConnected
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 MediBook API Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Auth Routes: http://localhost:${PORT}/api/auth`);
    console.log(`📍 Appointment Routes: http://localhost:${PORT}/api/appointments`);
    console.log(`====================================================`);
  });
};

startServer();
