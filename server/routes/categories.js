const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route   GET api/categories
// @desc    Get all service categories and sub-items from database
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Add a new category (for dynamic administrative changes)
// @access  Private/Admin (Public placeholder for MERN seeding verification)
router.post('/', async (req, res) => {
  const { name, subItems } = req.body;
  if (!name) {
    return res.status(400).json({ msg: 'Category name is required' });
  }

  try {
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    category = new Category({
      name,
      subItems: subItems || []
    });

    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    console.error('Error creating category:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
