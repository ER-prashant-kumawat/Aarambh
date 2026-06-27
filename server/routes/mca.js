const express = require('express');
const router = express.Router();

const TAKEN_NAMES = ["tata", "infosys", "reliance", "wipro", "flipkart", "swiggy", "zomato", "razorpay", "paytm", "ola", "amazon", "google", "apple", "microsoft", "uber"];

// @route   POST api/mca/check-name
// @desc    Simulate MCA name checker
// @access  Public
router.post('/check-name', async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ msg: 'Company name is required' });
  }

  try {
    const lowerName = name.toLowerCase().trim();
    const isTaken = TAKEN_NAMES.some(taken => lowerName.includes(taken));
    
    res.json({
      name: name.trim(),
      available: !isTaken
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
