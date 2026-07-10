const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Lead = require('../models/Lead');
const User = require('../models/User');
const auth = require('../middleware/auth');

// SMTP transporter is created once and reused for all outgoing emails.
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

const clampPercent = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 100;
  return Math.max(0, Math.min(100, Math.round(value)));
};


// POST /api/quote
router.post('/', async (req, res) => {
  console.log('[API/QUOTE] Incoming request at', new Date().toISOString());
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
    notes,
    completionPercent,
    missingFields,
  } = req.body;

  if (!name || !phone || !email || !cityState) {
    return res.status(400).json({
      success: false,
      msg: 'Name, Mobile Number, Email, and City & State are required fields.',
    });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      msg: 'Server misconfiguration: SMTP credentials are not set.',
    });
  }

  const formattedServices = Array.isArray(servicesRequired)
    ? servicesRequired.join(', ')
    : servicesRequired || 'Not Specified';

  try {
    const newLead = new Lead({
      name,
      phone,
      email,
      service: formattedServices,
      message: `Stage: ${businessStage || 'Not Specified'} | Structure: ${corporateStructure || 'Not Specified'} | Timeline: ${timeline || 'Not Specified'} | City: ${cityState || 'N/A'} | Notes: ${notes || 'None'}`,
      type: 'detailedQuote',
      completionPercent: clampPercent(completionPercent),
      missingFields: Array.isArray(missingFields)
        ? missingFields.filter((f) => typeof f === 'string').slice(0, 20)
        : [],
    });

    const savedLead = await newLead.save();

    const textContent = `
==================================================
NEW ONBOARDING & CORPORATE QUOTE REQUEST
==================================================
1. Contact Person Name : ${name}
2. Mobile Number       : ${phone} (WhatsApp preferred)
3. Email ID            : ${email}
4. City & State        : ${cityState || 'Not Specified'}
5. Proposed Startup    : ${startupName || 'Not Specified'}
6. Business Stage      : ${businessStage || 'Not Specified'}
7. Corporate Structure : ${corporateStructure || 'Not Specified'}
8. Services Required   : ${formattedServices}
9. Launch Timeline     : ${timeline || 'Not Specified'}
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
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${businessStage || 'Not Specified'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Desired Structure</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${corporateStructure || 'Not Specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Services Required</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${formattedServices}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Timeline</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${timeline || 'Not Specified'}</td>
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
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[API/QUOTE] Mail sent:', info.messageId);

    return res.status(200).json({
      success: true,
      msg: 'Quote request submitted and confirmation email sent successfully!',
      leadId: savedLead._id,
    });
  } catch (error) {
    console.error('[API/QUOTE] Operation failed:', error.message);
    return res.status(500).json({
      success: false,
      msg: 'Failed to process your request. Please try again.',
      error: error.message,
    });
  }
});

// POST /api/quote/professional
router.post('/professional', async (req, res) => {
  const {
    name,
    phone,
    email,
    cityState,
    role,
    companyName,
    organizationFocus,
    yearsExperience,
    need,
    notes,
  } = req.body;

  if (!name || !phone || !email || !cityState || !role || !need) {
    return res.status(400).json({
      success: false,
      msg: 'Name, phone, email, city/state, role, and requirement are required fields.',
    });
  }

  const requiresCompanyName = role === 'Company Owner' || role === 'CEO / Founder';
  if (requiresCompanyName && !companyName) {
    return res.status(400).json({
      success: false,
      msg: 'Company name is required for company owners and founders.',
    });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      msg: 'Server misconfiguration: SMTP credentials are not set.',
    });
  }

  try {
    const newLead = new Lead({
      name,
      phone,
      email,
      service: need,
      message: [
        `Role: ${role}`,
        `Company/Firm: ${companyName || 'Not Specified'}`,
        `Focus: ${organizationFocus || 'Not Specified'}`,
        `Experience: ${yearsExperience || 'Not Specified'}`,
        `City: ${cityState}`,
        `Notes: ${notes || 'None'}`,
      ].join(' | '),
      type: 'professionalQuote',
      completionPercent: 100,
      missingFields: [],
    });

    const savedLead = await newLead.save();

    const textContent = `
==================================================
NEW PROFESSIONAL / COMPANY OWNER INQUIRY
==================================================
1. Name              : ${name}
2. Mobile Number     : ${phone}
3. Email             : ${email}
4. City & State      : ${cityState}
5. Role              : ${role}
6. Company / Firm    : ${companyName || 'Not Specified'}
7. Primary Focus     : ${organizationFocus || 'Not Specified'}
8. Experience       : ${yearsExperience || 'Not Specified'}
9. Need             : ${need}
10. Additional Notes:
${notes || 'None provided'}
==================================================
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 8px; margin-top: 0;">New Professional / Company Owner Inquiry</h2>
        <p style="color: #475569; font-size: 14px;">A new user has submitted a separate professional inquiry form.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Name</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Mobile Number</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${phone}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">City &amp; State</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${cityState}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Role</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${role}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Company / Firm</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${companyName || 'Not Specified'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Primary Focus</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${organizationFocus || 'Not Specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Experience</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${yearsExperience || 'Not Specified'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Need</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${need}</td>
          </tr>
        </table>

        <h3 style="color: #0f172a; margin-top: 20px; font-size: 16px;">Additional Notes</h3>
        <div style="background-color: #f1f5f9; border-left: 4px solid #06b6d4; padding: 12px; border-radius: 6px; font-size: 14px; color: #334155; font-style: italic;">
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
      subject: `New Professional Inquiry - ${companyName || name}`,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[API/QUOTE/PROFESSIONAL] Mail sent:', info.messageId);

    return res.status(200).json({
      success: true,
      msg: 'Professional inquiry submitted successfully!',
      leadId: savedLead._id,
    });
  } catch (error) {
    console.error('[API/QUOTE/PROFESSIONAL] Operation failed:', error.message);
    return res.status(500).json({
      success: false,
      msg: 'Failed to process your request. Please try again.',
      error: error.message,
    });
  }
});

// GET /api/quote/status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email');
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const latestLead = await Lead.findOne({ email: user.email, type: 'detailedQuote' })
      .sort({ dateSubmitted: -1 })
      .select('completionPercent missingFields dateSubmitted');

    if (!latestLead) {
      return res.status(200).json({ success: true, found: false });
    }

    return res.status(200).json({
      success: true,
      found: true,
      completionPercent: latestLead.completionPercent ?? 100,
      missingFields: latestLead.missingFields || [],
      dateSubmitted: latestLead.dateSubmitted,
    });
  } catch (error) {
    console.error('[API/QUOTE/STATUS]', error.message);
    return res.status(500).json({ success: false, msg: 'Failed to fetch form status.' });
  }
});

module.exports = router;
