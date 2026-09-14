const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getStatus } = require('./config/db');
const seedInitialData = require('./config/seed');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`🚀 Clinic Living Plus API Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Auth Routes: http://localhost:${PORT}/api/auth`);
    console.log(`📍 Appointment Routes: http://localhost:${PORT}/api/appointments`);
  });
};

startServer();

