const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  // Corporate launching profile details
  companyName: { type: String, default: "My Startup Private Limited" },
  companyType: { type: String, default: "Private Limited Company" },
  registeredState: { type: String, default: "Karnataka" },
  incorporationStatus: { type: String, default: "processing" }, // 'processing' or 'completed'
  progressDays: { type: Number, default: 1 },
  totalDays: { type: Number, default: 7 },
  advisorName: { type: String, default: "CA Rohan Desai" },
  advisorPhone: { type: String, default: "+91 98001 22334" },
  panStatus: { type: String, default: "Applied" },
  tanStatus: { type: String, default: "Applied" },
  gstStatus: { type: String, default: "Pending Application" },
  milestoneStep: { type: Number, default: 1 } // 1 to 5
});

module.exports = mongoose.model('User', UserSchema);
