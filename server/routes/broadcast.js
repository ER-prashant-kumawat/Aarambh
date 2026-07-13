const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Lead = require('../models/Lead');
const StartupEvaluation = require('../models/StartupEvaluation');
const DscApplication = require('../models/DscApplication');
const Order = require('../models/Order');

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BATCH_SIZE = 50;

const SOURCES = {
  users: async () => (await User.find().select('email')).map((d) => d.email),
  leads: async () => (await Lead.find().select('email')).map((d) => d.email),
  evaluations: async () => (await StartupEvaluation.find().select('email')).map((d) => d.email),
  dsc: async () => (await DscApplication.find().select('email')).map((d) => d.email),
  orders: async () => (await Order.find().select('email')).map((d) => d.email),
};

// Gather unique, valid, lowercased emails from the requested sources.
async function collectEmails(sources) {
  const wanted = Array.isArray(sources) && sources.length > 0 ? sources : Object.keys(SOURCES);
  const set = new Set();
  for (const key of wanted) {
    if (!SOURCES[key]) continue;
    const emails = await SOURCES[key]();
    for (const e of emails) {
      const clean = (e || '').trim().toLowerCase();
      if (EMAIL_REGEX.test(clean)) set.add(clean);
    }
  }
  return [...set];
}

const escapeHtml = (s) => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// GET /api/broadcast/recipients — admin only, per-source unique email counts
router.get('/recipients', auth, adminAuth, async (req, res) => {
  try {
    const counts = {};
    for (const key of Object.keys(SOURCES)) {
      counts[key] = (await collectEmails([key])).length;
    }
    const total = (await collectEmails(Object.keys(SOURCES))).length;
    res.json({ success: true, counts, total });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Failed to count recipients', error: error.message });
  }
});

// POST /api/broadcast — admin only, send a mail to every collected user email
router.post('/', auth, adminAuth, async (req, res) => {
  const { subject, message, sources } = req.body;

  if (!subject || !subject.trim() || !message || !message.trim()) {
    return res.status(400).json({ success: false, msg: 'Subject and message are required.' });
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, msg: 'Email is not configured on the server (EMAIL_USER / EMAIL_PASS missing).' });
  }

  try {
    const recipients = await collectEmails(sources);
    if (recipients.length === 0) {
      return res.status(400).json({ success: false, msg: 'No valid recipient emails found for the selected groups.' });
    }

    const htmlBody = escapeHtml(message.trim()).replace(/\n/g, '<br/>');
    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; padding: 20px 24px;">
          <span style="color: #ffffff; font-size: 20px; font-weight: 800;">Aarambhh<span style="color: #34d399;">.</span></span>
        </div>
        <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.7;">
          ${htmlBody}
          <p style="margin-top: 20px;">Warm regards,<br/><strong>Team Aarambhh</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 12px 24px; font-size: 11px; color: #94a3b8;">
          You are receiving this email because you interacted with Aarambhh.com.
        </div>
      </div>`;

    let sent = 0;
    let failedBatches = 0;
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      try {
        // BCC keeps every recipient's address hidden from the others.
        await transporter.sendMail({
          from: `"Aarambhh" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          bcc: batch,
          subject: subject.trim(),
          text: message.trim(),
          html,
        });
        sent += batch.length;
      } catch (err) {
        failedBatches += 1;
        console.error(`[BROADCAST] Batch ${i / BATCH_SIZE + 1} failed:`, err.message);
      }
    }

    console.log(`[BROADCAST] "${subject.trim()}" sent to ${sent}/${recipients.length} recipients by ${req.user?.email || 'admin'}`);
    res.json({
      success: failedBatches === 0,
      msg: failedBatches === 0
        ? `Mail sent to ${sent} users.`
        : `Mail sent to ${sent} of ${recipients.length} users; ${failedBatches} batch(es) failed — check server logs.`,
      totalRecipients: recipients.length,
      sent,
    });
  } catch (error) {
    console.error('[BROADCAST] Error:', error);
    res.status(500).json({ success: false, msg: 'Failed to send broadcast', error: error.message });
  }
});

module.exports = router;
