const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Package details
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  packagePrice: { type: String, required: true },

  // Customer account details
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, default: '' },
  address: { type: String, required: true },
  cityState: { type: String, required: true },
  pincode: { type: String, default: '' },
  gstin: { type: String, default: '' },
  notes: { type: String, default: '' },

  // Order tracking
  status: { type: String, default: 'new' }, // 'new' → 'contacted' → 'payment-pending' → 'in-progress' → 'completed'
  dateSubmitted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
