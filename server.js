require('dotenv').config();
const express = require('express');
const logger = require('./config/logger');
const patientRoutes = require('./routes/patient.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/patients', patientRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  logger.info('Server shutting down gracefully');
  process.exit(0);
});

