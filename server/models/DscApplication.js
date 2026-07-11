const mongoose = require('mongoose');

const DscApplicationSchema = new mongoose.Schema({
  // Certificate configuration
  certificateClass: String,
  certificateType: String,
  validity: String,
  applicantType: String,
  isIndianCitizen: String,
  usbToken: String,
  personalAssistance: String,
  price: Number,

  // Applicant details
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  panNumber: String,
  aadhaarNumber: String,
  shippingAddress: String,

  // Bank details
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branchName: String,

  status: { type: String, default: 'submitted' },
  dateSubmitted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DscApplication', DscApplicationSchema);
