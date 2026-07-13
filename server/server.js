const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Init Middleware
const STATIC_ORIGINS = [
  'https://aarambh-git-main-vishal-sukhwal-s-projects.vercel.app',
  'https://aarambhh.com',
  'https://www.aarambhh.com',
  'https://aarambh.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  // Extra comma-separated origins can be added via env without a code change
  ...(process.env.FRONTEND_URLS || '').split(',').map((s) => s.trim()).filter(Boolean),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header), the allowlist,
    // and any Vercel deployment of the frontend (production + previews).
    if (!origin || STATIC_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }
    console.warn('[CORS] Blocked origin:', origin);
    return callback(null, false);
  },
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
app.use('/api/broadcast', require('./routes/broadcast'));
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

// ── Safety Nets ───────────────────────────────────────────────────────────────
// Unknown API route → clean JSON 404 instead of an HTML error page
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, msg: 'API route not found.' });
});

// Global error handler — any uncaught route error still returns clean JSON,
// so the frontend never sees a raw HTML error page or a dropped connection.
app.use((err, req, res, next) => {
  console.error('[SERVER] Unhandled error:', err.message);
  if (res.headersSent) return next(err);
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ success: false, msg: 'Invalid request data. Please refresh the page and try again.' });
  }
  if (err.name === 'MulterError') {
    const msg = err.code === 'LIMIT_FILE_SIZE'
      ? 'One of the attached files is larger than 5 MB. Please upload a smaller file.'
      : `File upload error: ${err.message}`;
    return res.status(400).json({ success: false, msg });
  }
  res.status(500).json({ success: false, msg: 'Something went wrong on the server. Please try again.' });
});

// Never let a stray async error crash the whole server
process.on('unhandledRejection', (err) => {
  console.error('[SERVER] Unhandled promise rejection:', err && err.message ? err.message : err);
});

// ── Local Development Server ──────────────────────────────────────────────────
// app.listen() is guarded so it does NOT run inside Vercel's serverless runtime.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`[SERVER] Running locally on port ${PORT}`));
}

// Required for Vercel — exports the Express app as the serverless handler
module.exports = app;
