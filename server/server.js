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
    'https://aarambhh.com',
    'https://www.aarambhh.com',
    'https://aarambh.vercel.app',
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
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/evaluations', require('./routes/evaluations'));
app.use('/api/dsc', require('./routes/dsc'));
app.use('/api/dashboard', require('./routes/dashboard'));
// Root route for server verification/health checks
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Aarambhh Backend API is running smoothly!",
    timestamp: new Date().toISOString()
  });
});

// Serve uploads in development only (Vercel has no persistent disk)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// ── Local Development Server ──────────────────────────────────────────────────
// app.listen() is guarded so it does NOT run inside Vercel's serverless runtime.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`[SERVER] Running locally on port ${PORT}`));
}

// Required for Vercel — exports the Express app as the serverless handler
module.exports = app;
