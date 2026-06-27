const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  service: { type: String },
  message: { type: String },
  type: { type: String, default: "callback" }, // "callback" or "nameCheckQuote"
  dateSubmitted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
