const mongoose = require('mongoose');

const SubItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true }
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subItems: [SubItemSchema]
});

module.exports = mongoose.model('Category', CategorySchema);
