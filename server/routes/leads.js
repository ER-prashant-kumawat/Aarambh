const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const buildAuditRecommendation = (answers = {}) => {
  const q1 = answers.q1 || '';
  const q2 = answers.q2 || '';
  const q3 = answers.q3 || '';

  if (q1 === 'No, we are unregistered' && q3 === "I'm a solo founder") {
    return {
      tier: 'Tier 1',
      price: 'Rs. 9,500',
      title: 'The Digital Foundation',
      pitch: 'Secure your digital assets and transition smoothly into a One Person Company (OPC) or Sole Proprietorship when ready.',
      link: '/packages/tier-1-digital-foundation',
      risk: 'Solo bootstrapper baseline risk'
    };
  }

  if (q1 === 'No, we are unregistered') {
    return {
      tier: 'Tier 3',
      price: 'Rs. 24,500',
      title: 'The Complete Tech-Legal Incubator',
      pitch: 'You need the full incorporation, website, and multi-founder legal baseline.',
      link: '/packages/tier-3-complete-incubator',
      risk: 'Raw startup structural risk'
    };
  }

  if (q1 === 'Yes' && q3 === "No, it's just a handshake/verbal") {
    return {
      tier: 'Tier 2',
      price: 'Rs. 14,000',
      title: 'The Co-Founder Shield',
      pitch: "Your biggest risk right now is losing your company to a co-founder dispute. Lock in your Founders' Agreement and NDA suite immediately.",
      link: '/packages/tier-2-cofounder-shield',
      risk: 'Vulnerable partnership risk'
    };
  }

  return {
    tier: 'Tier 1',
    price: 'Rs. 9,500',
    title: 'The Digital Foundation',
    pitch: 'Your corporate structure is sound, but your digital footprint is exposed. Deploy a secure web presence and DPDP-compliant privacy policies.',
    link: '/packages/tier-1-digital-foundation',
    risk: 'Digital privacy and security risk'
  };
};

const buildWhatsAppMessage = (name, recommendation, resultLink) => {
  const fallbackBaseUrl = process.env.PUBLIC_APP_URL || 'https://aarambhh.com';
  const resultUrl = resultLink || `${fallbackBaseUrl}${recommendation.link}`;

  return `Hey ${name}, thanks for taking the Aarambhh Audit. Your platform flagged a compliance risk based on your answers. Let's schedule a quick 5-minute chat to map out your infrastructure. Here is a custom breakdown of the Tier we recommended for you: ${resultUrl}`;
};

const saveLead = async ({ name, phone, email, service, message, type, source, answers, recommendation, resultLink, whatsappMessage }) => {
  const lead = new Lead({
    name,
    phone,
    email,
    service,
    message,
    type,
    source,
    answers,
    recommendation,
    resultLink,
    whatsappMessage,
    whatsappStatus: process.env.WHATSAPP_WEBHOOK_URL ? 'queued' : 'not_configured',
  });

  const savedLead = await lead.save();

  if (process.env.WHATSAPP_WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: savedLead._id,
          name,
          phone,
          resultLink,
          whatsappMessage,
          answers,
          recommendation,
          source,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        savedLead.whatsappStatus = 'failed';
        savedLead.whatsappError = errorText.slice(0, 500);
        await savedLead.save();
      } else {
        savedLead.whatsappStatus = 'queued';
        await savedLead.save();
      }
    } catch (error) {
      savedLead.whatsappStatus = 'failed';
      savedLead.whatsappError = error.message;
      await savedLead.save();
    }
  }

  return savedLead;
};

// @route   POST api/leads/callback
// @desc    Capture a callback request
// @access  Public
router.post('/callback', async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ msg: 'Name and phone are required' });
  }

  try {
    const lead = await saveLead({
      name,
      phone,
      email,
      service,
      message,
      type: req.body.type || 'callback',
      source: req.body.source || 'callback-form',
      answers: req.body.answers || {},
      recommendation: req.body.recommendation || {},
      resultLink: req.body.resultLink || '',
      whatsappMessage: req.body.whatsappMessage || '',
    });

    res.json({ success: true, data: lead });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/leads/quote
// @desc    Capture a quote request
// @access  Public
router.post('/quote', async (req, res) => {
  const { name, phone, email, service } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ msg: 'Name and phone are required' });
  }

  try {
    const lead = await saveLead({
      name,
      phone,
      email,
      service,
      type: 'nameCheckQuote',
      source: req.body.source || 'quote-form',
      answers: req.body.answers || {},
      recommendation: req.body.recommendation || {},
      resultLink: req.body.resultLink || '',
      whatsappMessage: req.body.whatsappMessage || '',
    });

    res.json({ success: true, data: lead });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/leads/audit
// @desc    Capture the homepage audit lead and queue the WhatsApp follow-up payload
// @access  Public
router.post('/audit', async (req, res) => {
  const { name, phone, answers, source, resultLink } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ msg: 'Name and phone are required' });
  }

  try {
    const recommendation = req.body.recommendation && req.body.recommendation.tier ? req.body.recommendation : buildAuditRecommendation(answers);
    const whatsappMessage = req.body.whatsappMessage || buildWhatsAppMessage(name, recommendation, resultLink || '');
    const savedLead = await saveLead({
      name,
      phone,
      type: 'audit',
      source: source || 'homepage-audit-tool',
      answers: answers || {},
      recommendation,
      resultLink: resultLink || recommendation.link,
      whatsappMessage,
    });

    res.json({ success: true, data: savedLead, recommendation, whatsappMessage });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/leads
// @desc    List all captured leads (callback/quote/audit/professional/BCI Yuva etc.)
// @access  Private (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ dateSubmitted: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;


