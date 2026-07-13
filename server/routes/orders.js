const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// ─── SMTP Transporter (same config as quote route) ───────────────────────────
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
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  }
});

// ─── POST /api/orders ────────────────────────────────────────────────────────
// @desc    Place a Premium Package order — save to DB AND notify admin by email.
// @access  Public
router.post('/', async (req, res) => {
  console.log('[API/ORDERS] ─── Incoming order at', new Date().toISOString());

  const {
    packageId,
    packageName,
    packagePrice,
    name,
    phone,
    email,
    companyName,
    address,
    cityState,
    pincode,
    gstin,
    notes
  } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!packageId || !packageName || !packagePrice) {
    return res.status(400).json({
      success: false,
      msg: 'Package details are missing. Please reselect your package.'
    });
  }
  if (!name || !phone || !email || !address || !cityState) {
    return res.status(400).json({
      success: false,
      msg: 'Name, Mobile Number, Email, Address, and City & State are required fields.'
    });
  }

  try {
    // ── STEP 1: Save order to database ─────────────────────────────────────────
    console.log('[API/ORDERS] 💾 Saving order to database...');
    const newOrder = new Order({
      packageId,
      packageName,
      packagePrice,
      name,
      phone,
      email,
      companyName: companyName || '',
      address,
      cityState,
      pincode: pincode || '',
      gstin: gstin || '',
      notes: notes || ''
    });
    const savedOrder = await newOrder.save();
    console.log('[API/ORDERS] ✅ Order saved to DB. ID:', savedOrder._id);

    // ── STEP 2: Notify admin by email ──────────────────────────────────────────
    const textContent = `
==================================================
NEW PREMIUM PACKAGE ORDER
==================================================
Package            : ${packageName}
Price              : ${packagePrice}
--------------------------------------------------
1. Customer Name   : ${name}
2. Mobile Number   : ${phone} (WhatsApp preferred)
3. Email ID        : ${email}
4. Company Name    : ${companyName || 'Not Specified'}
5. Address         : ${address}
6. City & State    : ${cityState}
7. Pincode         : ${pincode || 'Not Specified'}
8. GSTIN           : ${gstin || 'Not Specified'}
9. Notes           :
${notes || 'None provided'}
--------------------------------------------------
Order ID           : ${savedOrder._id}
==================================================
    `.trim();

    const row = (label, value, shaded) => `
      <tr${shaded ? ' style="background-color: #f8fafc;"' : ''}>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">${label}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0;">${value}</td>
      </tr>`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 0;">🛒 New Premium Package Order</h2>
        <p style="color: #475569; font-size: 14px;">A customer has placed an order for a Premium Package on Aarambhh.com.</p>

        <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 14px; margin: 15px 0;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #065f46;">${packageName}</p>
          <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold; color: #0f172a;">${packagePrice}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          ${row('Customer Name', name, true)}
          ${row('Mobile Number', `${phone} (WhatsApp preferred)`, false)}
          ${row('Email ID', `<a href="mailto:${email}">${email}</a>`, true)}
          ${row('Company Name', companyName || 'Not Specified', false)}
          ${row('Address', address, true)}
          ${row('City & State', cityState, false)}
          ${row('Pincode', pincode || 'Not Specified', true)}
          ${row('GSTIN', gstin || 'Not Specified', false)}
        </table>

        <h3 style="color: #0f172a; margin-top: 20px; font-size: 16px;">Customer Notes</h3>
        <div style="background-color: #f1f5f9; border-left: 4px solid #10b981; padding: 12px; border-radius: 6px; font-size: 14px; color: #334155; font-style: italic;">
          ${notes ? notes.replace(/\n/g, '<br>') : 'No extra notes provided.'}
        </div>

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
          This email was automatically generated by the Aarambhh Backend Server. | Order ID: ${savedOrder._id}
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Aarambhh Orders" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_NOTIFY_EMAIL || 'aarambhh100@gmail.com',
      replyTo: email,
      subject: `🛒 New Package Order: ${packageName} — ${name}`,
      text: textContent,
      html: htmlContent
    };

    // Respond as soon as the order is saved — the admin email goes out in the
    // background so a slow or failed SMTP connection can never fail the order.
    res.status(200).json({
      success: true,
      msg: 'Order placed successfully! Our team will contact you shortly.',
      orderId: savedOrder._id
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('[API/ORDERS] 📧 Sending order email via SMTP...');
      transporter.sendMail(mailOptions)
        .then((info) => console.log('[API/ORDERS] ✅ Order email sent. Message ID:', info.messageId))
        .catch((err) => console.error('[API/ORDERS] ❌ Order email failed:', err.message));
    } else {
      console.error('[API/ORDERS] ⚠️ SMTP credentials missing — admin email skipped.');
    }

  } catch (error) {
    console.error('[API/ORDERS] ❌ OPERATION FAILED:', error.message);
    if (res.headersSent) return;
    return res.status(500).json({
      success: false,
      msg: 'Failed to place your order. Please try again.',
      error: error.message
    });
  }
});

// @route   GET api/orders
// @desc    List all premium package orders
// @access  Private (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ dateSubmitted: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
