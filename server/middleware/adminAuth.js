const User = require('../models/User');

// Must run after the `auth` middleware (needs req.user.id already set).
module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('email');
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(user.email.toLowerCase())) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
