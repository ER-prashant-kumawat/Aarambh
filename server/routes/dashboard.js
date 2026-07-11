const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   PUT api/dashboard/compliance
// @desc    Toggle a compliance item's configured state for the logged-in user
// @access  Private
router.put('/compliance', auth, async (req, res) => {
  const { index, configured } = req.body;

  if (typeof index !== 'number') {
    return res.status(400).json({ msg: 'A numeric item index is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const set = new Set(user.complianceConfigured || []);
    if (configured) set.add(index);
    else set.delete(index);
    user.complianceConfigured = Array.from(set);

    await user.save();
    const safeUser = await User.findById(req.user.id).select('-password');
    res.json(safeUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/dashboard/tech-setup
// @desc    Update email/web plan selections and activation flags
// @access  Private
router.put('/tech-setup', auth, async (req, res) => {
  const { emailPlan, webPlan, emailActivated, webLaunched } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (emailPlan !== undefined) user.emailPlan = emailPlan;
    if (webPlan !== undefined) user.webPlan = webPlan;
    if (emailActivated !== undefined) user.emailActivated = emailActivated;
    if (webLaunched !== undefined) user.webLaunched = webLaunched;

    await user.save();
    const safeUser = await User.findById(req.user.id).select('-password');
    res.json(safeUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
