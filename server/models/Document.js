const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "Identity Document"
  size: { type: String, required: true }, // e.g. "1.2 MB"
  ext: { type: String, required: true },  // e.g. "PDF"
  filePath: { type: String, required: true },
  status: { type: String, default: "pending" }, // "verified" | "active" | "pending"
  dateUploaded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
