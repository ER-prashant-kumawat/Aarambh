const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// @route   POST api/leads/callback
// @desc    Capture a callback request
// @access  Public
router.post('/callback', async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ msg: 'Name and phone are required' });
  }

  try {
    const newLead = new Lead({
      name,
      phone,
      email,
      service,
      message,
      type: req.body.type || 'callback'
    });

    const lead = await newLead.save();
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
    const newLead = new Lead({
      name,
      phone,
      email,
      service,
      type: 'nameCheckQuote'
    });

    const lead = await newLead.save();
    res.json({ success: true, data: lead });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
