const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Init Middleware
app.use(cors({
  origin: [
    'https://aarambh-git-main-vishal-sukhwal-s-projects.vercel.app',
    'https://www.aarambhh.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ extended: false }));

// ── Serverless DB Middleware ──────────────────────────────────────────────────
// In serverless environments, we cannot guarantee the DB is connected at
// module load time. This middleware ensures the connection is established
// (or reused from cache) before every request hits a route handler.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[SERVER] DB connection failed:', error.message);
    return res.status(503).json({
      success: false,
      msg: 'Database temporarily unavailable. Please try again.',
    });
  }
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/mca', require('./routes/mca'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/quote', require('./routes/quote'));
app.use('/api/categories', require('./routes/categories'));

// Serve uploads in development only (Vercel has no persistent disk)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// ── Local Development Server ──────────────────────────────────────────────────
// app.listen() is guarded so it does NOT run inside Vercel's serverless runtime.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`[SERVER] Running locally on port ${PORT}`));
}

// Required for Vercel — exports the Express app as the serverless handler
module.exports = app;
