const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const StartupEvaluation = require('../models/StartupEvaluation');
const { evaluateStartup } = require('../utils/evaluationScorer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB per file
});

const fileFields = upload.fields([
  { name: 'pitchDeck', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 },
  { name: 'incorporationCert', maxCount: 1 },
  { name: 'trademarkCert', maxCount: 1 },
  { name: 'gstCert', maxCount: 1 },
  { name: 'onePager', maxCount: 1 },
  { name: 'financialProjection', maxCount: 1 },
  { name: 'founderResume', maxCount: 1 }
]);

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

const toFileAsset = (file) => file ? {
  filename: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  data: file.buffer.toString('base64')
} : undefined;

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return [value];
  }
};

// POST /api/evaluations — public submission
router.post('/', fileFields, async (req, res) => {
  const b = req.body;

  if (!b.founderName || !b.email || !b.mobileNumber) {
    return res.status(400).json({ success: false, msg: 'Founder name, email, and mobile number are required.' });
  }

  try {
    const files = req.files || {};

    const doc = new StartupEvaluation({
      founderName: b.founderName,
      email: b.email,
      mobileNumber: b.mobileNumber,
      linkedinProfile: b.linkedinProfile,
      cityCountry: b.cityCountry,
      startupName: b.startupName,
      website: b.website,
      industrySector: b.industrySector,
      stage: b.stage,
      fullTime: b.fullTime,
      numberOfFounders: b.numberOfFounders,
      founderBackground: b.founderBackground,

      oneLineDescription: b.oneLineDescription,
      problemSolved: b.problemSolved,
      targetCustomer: b.targetCustomer,
      howItWorks: b.howItWorks,
      differentiation: b.differentiation,

      targetMarket: b.targetMarket,
      estimatedMarketSize: b.estimatedMarketSize,
      mainCompetitors: b.mainCompetitors,
      whyCustomersChooseYou: b.whyCustomersChooseYou,

      productStage: b.productStage,
      pitchDeck: toFileAsset(files.pitchDeck?.[0]),
      productDemoLink: b.productDemoLink,
      screenshots: (files.screenshots || []).map(toFileAsset),

      numberOfUsers: b.numberOfUsers,
      payingCustomers: b.payingCustomers,
      monthlyRevenue: b.monthlyRevenue,
      monthlyGrowthPercent: b.monthlyGrowthPercent,
      pilotCustomers: b.pilotCustomers,
      partnerships: b.partnerships,

      howYouMakeMoney: b.howYouMakeMoney,
      pricingModel: b.pricingModel,
      expectedRevenue12Months: b.expectedRevenue12Months,

      raisedFundingBefore: b.raisedFundingBefore,
      amountRaised: b.amountRaised,
      expectedFundingCurrentStage: b.expectedFundingCurrentStage,
      plannedUseOfFunds: parseList(b.plannedUseOfFunds),

      legalCompliance: parseList(b.legalCompliance),
      incorporationCert: toFileAsset(files.incorporationCert?.[0]),
      trademarkCert: toFileAsset(files.trademarkCert?.[0]),
      gstCert: toFileAsset(files.gstCert?.[0]),

      whyBuildingThis: b.whyBuildingThis,
      fiveYearVision: b.fiveYearVision,
      whyInvestInYou: b.whyInvestInYou,

      onePager: toFileAsset(files.onePager?.[0]),
      financialProjection: toFileAsset(files.financialProjection?.[0]),
      founderResume: toFileAsset(files.founderResume?.[0]),
      demoVideoLink: b.demoVideoLink,
      founderVideoLink: b.founderVideoLink
    });

    doc.aiEvaluation = evaluateStartup(doc.toObject());

    await doc.save();

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const startupLabel = b.startupName || 'Unnamed Startup';
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_NOTIFY_EMAIL || 'aarambhh100@gmail.com',
        replyTo: b.email,
        subject: `New Startup Evaluation: ${startupLabel} (Score: ${doc.aiEvaluation.overallScore}/100)`,
        text: `${b.founderName} (${b.email}, ${b.mobileNumber}) submitted an evaluation for "${startupLabel}". Overall AI score: ${doc.aiEvaluation.overallScore}/100. Review it in the admin dashboard.`
      }).catch((err) => console.error('[EVALUATIONS] Email notification failed:', err.message));

      transporter.sendMail({
        from: `"Aarambhh" <${process.env.EMAIL_USER}>`,
        to: b.email,
        subject: `Aarambhh — Your Startup Evaluation Form Has Been Submitted Successfully`,
        text: `Dear ${b.founderName},\n\nThank you for submitting the Basic Startup Evaluation Form for "${startupLabel}" on Aarambhh.\n\nYour form has been submitted successfully and is now under review by our team. We will get back to you shortly with the next steps.\n\nIf you have any questions in the meantime, simply reply to this email.\n\nWarm regards,\nTeam Aarambhh\naarambhh100@gmail.com`,
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #0f172a; padding: 20px 24px;">
              <span style="color: #ffffff; font-size: 20px; font-weight: 800;">Aarambhh<span style="color: #34d399;">.</span></span>
            </div>
            <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.7;">
              <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 12px;">Your form has been submitted successfully ✅</h2>
              <p>Dear <strong>${b.founderName}</strong>,</p>
              <p>Thank you for submitting the <strong>Basic Startup Evaluation Form</strong> for <strong>"${startupLabel}"</strong> on Aarambhh.</p>
              <p>Your form has been received successfully and is now under review by our team. We will get back to you shortly with the next steps.</p>
              <p>If you have any questions in the meantime, simply reply to this email.</p>
              <p style="margin-top: 20px;">Warm regards,<br/><strong>Team Aarambhh</strong><br/>aarambhh100@gmail.com</p>
            </div>
            <div style="background: #f8fafc; padding: 12px 24px; font-size: 11px; color: #94a3b8;">
              This is an automated confirmation from Aarambhh.com. Please do not share sensitive information over email.
            </div>
          </div>`
      }).catch((err) => console.error('[EVALUATIONS] Confirmation email to user failed:', err.message));
    }

    res.status(200).json({ success: true, msg: 'Evaluation submitted successfully', evaluationId: doc._id });
  } catch (error) {
    console.error('[EVALUATIONS] Submission error:', error);
    res.status(500).json({ success: false, msg: 'Failed to submit evaluation', error: error.message });
  }
});

// GET /api/evaluations — admin only, list summaries
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const list = await StartupEvaluation.find()
      .select('founderName startupName email mobileNumber stage industrySector aiEvaluation.overallScore dateSubmitted status')
      .sort({ dateSubmitted: -1 });
    res.json({ success: true, evaluations: list });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Failed to fetch evaluations', error: error.message });
  }
});

// GET /api/evaluations/:id — admin only, full detail
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const evaluation = await StartupEvaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ success: false, msg: 'Evaluation not found' });
    res.json({ success: true, evaluation });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Failed to fetch evaluation', error: error.message });
  }
});

module.exports = router;
