const mongoose = require('mongoose');

const FileAssetSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  size: Number,
  path: String,
  data: String // legacy base64 support
}, { _id: false });

const StartupEvaluationSchema = new mongoose.Schema({
  // Section 1: Founder Details
  founderName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  linkedinProfile: String,
  cityCountry: String,
  startupName: String,
  website: String,
  industrySector: String,
  stage: { type: String, enum: ['Idea', 'Prototype', 'MVP', 'Early Revenue', ''], default: '' },
  fullTime: String,
  numberOfFounders: String,
  founderBackground: String,

  // Section 2: Startup Overview
  oneLineDescription: String,
  problemSolved: String,
  targetCustomer: String,
  howItWorks: String,
  differentiation: String,

  // Section 3: Market Opportunity
  targetMarket: String,
  estimatedMarketSize: String,
  mainCompetitors: String,
  whyCustomersChooseYou: String,

  // Section 4: Product Status
  productStage: { type: String, enum: ['Idea', 'Prototype', 'MVP', 'Live Product', ''], default: '' },
  pitchDeck: FileAssetSchema,
  productDemoLink: String,
  screenshots: [FileAssetSchema],

  // Section 5: Customers & Traction
  numberOfUsers: String,
  payingCustomers: String,
  monthlyRevenue: String,
  monthlyGrowthPercent: String,
  pilotCustomers: String,
  partnerships: String,

  // Section 6: Business Model
  howYouMakeMoney: String,
  pricingModel: { type: String, enum: ['Subscription', 'Commission', 'One-time Sale', 'Marketplace', 'Freemium', 'Other', ''], default: '' },
  expectedRevenue12Months: String,

  // Section 7: Funding
  raisedFundingBefore: String,
  amountRaised: String,
  expectedFundingCurrentStage: String,
  plannedUseOfFunds: { type: [String], default: [] },

  // Section 8: Legal & Compliance
  legalCompliance: { type: [String], default: [] },
  incorporationCert: FileAssetSchema,
  trademarkCert: FileAssetSchema,
  gstCert: FileAssetSchema,

  // Section 9: Vision
  whyBuildingThis: String,
  fiveYearVision: String,
  whyInvestInYou: String,

  // Documents (optional)
  onePager: FileAssetSchema,
  financialProjection: FileAssetSchema,
  founderResume: FileAssetSchema,
  demoVideoLink: String,
  founderVideoLink: String,

  // AI Evaluation (admin only)
  aiEvaluation: {
    scores: {
      founderProfile: { type: Number, default: 0 },
      problemSolution: { type: Number, default: 0 },
      marketOpportunity: { type: Number, default: 0 },
      productReadiness: { type: Number, default: 0 },
      traction: { type: Number, default: 0 },
      businessModel: { type: Number, default: 0 },
      fundingReadiness: { type: Number, default: 0 },
      legalCompliance: { type: Number, default: 0 },
      visionInvestment: { type: Number, default: 0 }
    },
    overallScore: { type: Number, default: 0 },
    strengths: { type: [String], default: [] },
    risks: { type: [String], default: [] },
    missingInfo: { type: [String], default: [] },
    nextSteps: { type: [String], default: [] }
  },

  status: { type: String, default: 'submitted' },
  dateSubmitted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StartupEvaluation', StartupEvaluationSchema);
