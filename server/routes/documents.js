const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Document = require('../models/Document');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max
});

// @route   POST api/documents/upload
// @desc    Upload a document to vault
// @access  Private
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const ext = path.extname(req.file.originalname).substring(1).toUpperCase();
    const baseName = path.basename(req.file.originalname, path.extname(req.file.originalname));

    const newDoc = new Document({
      user: req.user.id,
      name: baseName,
      type: req.body.type || 'Uploaded Document',
      size: fileSizeMB,
      ext: ext,
      filePath: req.file.filename,
      status: 'verified'
    });

    const doc = await newDoc.save();
    res.json(doc);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/documents
// @desc    Get user's documents
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id }).sort({ dateUploaded: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/documents/:id/download
// @desc    Download a document
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    if (doc.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const fullPath = path.join(uploadDir, doc.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ msg: 'Physical file not found on server' });
    }

    res.download(fullPath, `${doc.name}.${doc.ext.toLowerCase()}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    if (doc.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const fullPath = path.join(uploadDir, doc.filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Document removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
