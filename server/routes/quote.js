const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Lead = require('../models/Lead');

// ─── SMTP Transporter ────────────────────────────────────────────────────────
// Instantiated once at module load, not on every request.
// family:4 forces IPv4 — bypasses Render's IPv6 ENETUNREACH block.
// pool:true reuses connections across sends.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,          // STARTTLS — must be false for port 587
  family: 4,              // Force IPv4 for Render cloud compatibility
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

// ─── POST /api/quote ─────────────────────────────────────────────────────────
// @desc    Save lead to DB AND send admin email — both must succeed.
// @access  Public
router.post('/', async (req, res) => {
  console.log('[API/QUOTE] ─── Incoming request at', new Date().toISOString());
  console.log('[API/QUOTE] Request Body:', JSON.stringify(req.body, null, 2));

  const {
    name,
    phone,
    email,
    cityState,
    startupName,
    businessStage,
    corporateStructure,
    servicesRequired,
    timeline,
    notes
  } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!name || !phone || !email) {
    console.warn('[API/QUOTE] ⚠️  Validation failed: Missing name, phone, or email.');
    return res.status(400).json({
      success: false,
      msg: 'Name, Phone, and Email are required fields.'
    });
  }

  // ── Env Guard ───────────────────────────────────────────────────────────────
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('[API/QUOTE] ❌ SMTP credentials missing in environment variables.');
    return res.status(500).json({
      success: false,
      msg: 'Server misconfiguration: SMTP credentials are not set.'
    });
  }

  const formattedServices = Array.isArray(servicesRequired)
    ? servicesRequired.join(', ')
    : servicesRequired || 'Not Specified';

  // ── Single Unified Try/Catch — DB + Email are atomic ────────────────────────
  try {

    // ── STEP 1: Save Lead to Database ─────────────────────────────────────────
    console.log('[API/QUOTE] 💾 Saving lead to database...');
    const newLead = new Lead({
      name,
      phone,
      email,
      service: formattedServices,
      message: `Stage: ${businessStage} | Structure: ${corporateStructure} | Timeline: ${timeline} | City: ${cityState || 'N/A'} | Notes: ${notes || 'None'}`,
      type: 'detailedQuote'
    });
    const savedLead = await newLead.save();
    console.log('[API/QUOTE] ✅ Lead saved to DB. ID:', savedLead._id);

    // ── STEP 2: Build Mail Payload ────────────────────────────────────────────
    const textContent = `
==================================================
NEW ONBOARDING & CORPORATE QUOTE REQUEST
==================================================
1. Contact Person Name : ${name}
2. Mobile Number       : ${phone} (WhatsApp preferred)
3. Email ID            : ${email}
4. City & State        : ${cityState || 'Not Specified'}
5. Proposed Startup    : ${startupName || 'Not Specified'}
6. Business Stage      : ${businessStage}
7. Corporate Structure : ${corporateStructure}
8. Services Required   : ${formattedServices}
9. Launch Timeline     : ${timeline}
10. Notes / Pain Points:
${notes || 'None provided'}
==================================================
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 0;">New Onboarding &amp; Quote Request</h2>
        <p style="color: #475569; font-size: 14px;">A new user has submitted a corporate quote questionnaire on the Aarambhh Onboarding Portal.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Contact Person</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Mobile Number</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${phone} (WhatsApp preferred)</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Email ID</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">City &amp; State</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${cityState || 'Not Specified'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Proposed Startup</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${startupName || 'Not Specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Business Stage</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${businessStage}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Desired Structure</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${corporateStructure}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Services Required</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${formattedServices}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Timeline</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${timeline}</td>
          </tr>
        </table>

        <h3 style="color: #0f172a; margin-top: 20px; font-size: 16px;">Specific Notes &amp; Pain Points</h3>
        <div style="background-color: #f1f5f9; border-left: 4px solid #10b981; padding: 12px; border-radius: 6px; font-size: 14px; color: #334155; font-style: italic;">
          ${notes ? notes.replace(/\n/g, '<br>') : 'No extra notes provided.'}
        </div>

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
          This email was automatically generated and sent from the Aarambhh Backend Server. | Lead ID: ${savedLead._id}
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Aarambhh Onboarding" <${process.env.EMAIL_USER}>`,
      to: 'vishal.kvanta@gmail.com',
      replyTo: email,
      subject: `New Corporate Quote Request - ${startupName || name}`,
      text: textContent,
      html: htmlContent
    };

    // ── STEP 3: Send Email — explicit await, no fire-and-forget ───────────────
    console.log('[API/QUOTE] 📧 Sending email via SMTP...');
    const info = await transporter.sendMail(mailOptions);
    console.log('[API/QUOTE] 🔥 REAL MAIL SENT SUCCESS. Message ID:', info.messageId);

    // ── STEP 4: Return success ONLY when both DB save AND email succeed ────────
    return res.status(200).json({
      success: true,
      msg: 'Quote request submitted and confirmation email sent successfully!',
      leadId: savedLead._id
    });

  } catch (error) {
    // Any failure — DB write OR email send — surfaces here with a real 500.
    // The frontend will correctly show an error state instead of silent success.
    console.error('[API/QUOTE] ❌ OPERATION FAILED:', error.message);
    console.error('[API/QUOTE] Full error stack:', error.stack);
    return res.status(500).json({
      success: false,
      msg: 'Failed to process your request. Please try again.',
      error: error.message
    });
  }
});

module.exports = router;
