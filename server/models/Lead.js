const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  service: { type: String },
  message: { type: String },
  type: { type: String, default: 'callback' },
  source: { type: String },
  answers: { type: mongoose.Schema.Types.Mixed, default: {} },
  recommendation: { type: mongoose.Schema.Types.Mixed, default: {} },
  resultLink: { type: String },
  whatsappMessage: { type: String },
  whatsappStatus: { type: String, default: 'not_configured' },
  whatsappError: { type: String },
  completionPercent: { type: Number, default: 100, min: 0, max: 100 },
  missingFields: { type: [String], default: [] },
  dateSubmitted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
