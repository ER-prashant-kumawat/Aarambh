const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categoriesData = [
  {
    name: 'REGISTRATIONS',
    subItems: [
      { name: 'Private Limited Company', slug: 'pvt-ltd' },
      { name: 'LLP Registration', slug: 'llp' }
    ]
  },
  {
    name: 'COMPLIANCE',
    subItems: [
      { name: 'GST Registration', slug: 'gst' },
      { name: 'Startup India Recognition', slug: 'startup-india' }
    ]
  },
  {
    name: 'IPR',
    subItems: [
      { name: 'Trademark Registration', slug: 'trademark' }
    ]
  },
  {
    name: 'AGREEMENT AND CONTRACTS',
    subItems: [
      { name: 'Memorandum of Understanding MoU', slug: 'mou' },
      { name: 'Joint Venture Agreement', slug: 'jv-agreement' }
    ]
  },
  {
    name: 'TOOLS',
    subItems: [
      { name: 'NIC Code', slug: 'nic-code' },
      { name: 'Trademark Search', slug: 'tm-search' },
      { name: 'Company Name Check', slug: 'name-check' },
      { name: 'Company Details', slug: 'company-details' },
      { name: 'Trademark Class Search', slug: 'tm-class-search' },    ]
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aarambhh';
    console.log(`Connecting to database for seeding all 5 footer categories: ${mongoUri}...`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Clear old categories
    await Category.deleteMany();
    console.log('Cleared existing categories from collection.');

    // Seed all categories
    await Category.insertMany(categoriesData);
    console.log('Successfully seeded all 5 service categories & sub-items!');

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Category seeding failed:', err);
    process.exit(1);
  }
};

seedDB();

