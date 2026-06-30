const mongoose = require('mongoose');

// Cache the connection across serverless function invocations.
// Vercel reuses warm Lambda instances — this prevents opening a new
// connection on every request.
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection in progress, start one
  if (!cached.promise) {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      // Do NOT call process.exit() — it crashes the serverless function.
      // Throw instead so the calling route can return a proper 500.
      throw new Error('MONGO_URI environment variable is not defined.');
    }

    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast on cold start (5s max)
      socketTimeoutMS: 45000,
    }).then((mongooseInstance) => {
      console.log(`[DB] MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the cached promise so the next request retries the connection
    cached.promise = null;
    console.error(`[DB] MongoDB Connection Error: ${error.message}`);
    // Throw — do NOT call process.exit(). Let the route handler return 500.
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
