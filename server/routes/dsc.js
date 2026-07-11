const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const DscApplication = require('../models/DscApplication');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4,
  pool: true,
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
});

// POST /api/dsc — public submission
router.post('/', async (req, res) => {
  const b = req.body;

  if (!b.fullName || !b.email || !b.mobileNumber) {
    return res.status(400).json({ success: false, msg: 'Full name, email, and mobile number are required.' });
  }
  if (!b.accountHolderName || !b.bankName || !b.accountNumber || !b.ifscCode) {
    return res.status(400).json({ success: false, msg: 'Bank account holder name, bank name, account number, and IFSC code are required.' });
  }

  try {
    const doc = new DscApplication({
      certificateClass: b.certificateClass,
      certificateType: b.certificateType,
      validity: b.validity,
      applicantType: b.applicantType,
      isIndianCitizen: b.isIndianCitizen,
      usbToken: b.usbToken,
      personalAssistance: b.personalAssistance,
      price: b.price,

      fullName: b.fullName,
      email: b.email,
      mobileNumber: b.mobileNumber,
      panNumber: b.panNumber,
      aadhaarNumber: b.aadhaarNumber,
      shippingAddress: b.shippingAddress,

      accountHolderName: b.accountHolderName,
      bankName: b.bankName,
      accountNumber: b.accountNumber,
      ifscCode: b.ifscCode,
      branchName: b.branchName
    });

    await doc.save();

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'vishal.kvanta@gmail.com',
        replyTo: b.email,
        subject: `New DSC Application: ${b.fullName} (${b.certificateClass || 'DSC'})`,
        text: `${b.fullName} (${b.email}, ${b.mobileNumber}) applied for a ${b.certificateClass} / ${b.certificateType} DSC, validity ${b.validity}, price Rs. ${b.price}. Bank: ${b.bankName}, A/C: ${b.accountNumber}, IFSC: ${b.ifscCode}.`
      }).catch((err) => console.error('[DSC] Email notification failed:', err.message));
    }

    res.status(200).json({ success: true, msg: 'DSC application submitted successfully', applicationId: doc._id });
  } catch (error) {
    console.error('[DSC] Submission error:', error);
    res.status(500).json({ success: false, msg: 'Failed to submit application', error: error.message });
  }
});

// GET /api/dsc — admin only, list applications
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const list = await DscApplication.find().sort({ dateSubmitted: -1 });
    res.json({ success: true, applications: list });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Failed to fetch applications', error: error.message });
  }
});

module.exports = router;
