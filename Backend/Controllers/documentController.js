const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// ======================
// POST: Upload Document
// ======================
exports.uploadDocument = async (req, res) => {
  console.log('--- UPLOAD DOCUMENT START ---');

  try {
    const { name, email, docType } = req.body;

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File naming and path
    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadsDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, filename);

    // Ensure uploads folder exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Write buffer to file system
    fs.writeFileSync(filePath, req.file.buffer);
    console.log('✅ File saved to:', filePath);

    // Create DB entry
    const document = new Document({
      name,
      email,
      docType,
      filePath: filename // just filename (not full path)
    });

    await document.save();
    console.log('✅ Document saved to DB');

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });

    console.log('--- UPLOAD DOCUMENT END ---');
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// ======================
// GET: All Documents
// ======================
exports.getDocuments = async (req, res) => {
  try {
    const { docType } = req.query;
    const filter = docType ? { docType } : {};

    const documents = await Document.find(filter).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
};

// ============================
// PUT: Update Verification Status
// ============================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expects 'status', not 'verified'

    // Validate status
    if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const document = await Document.findByIdAndUpdate(id, { status }, { new: true });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Status updated', document });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// ======================
// GET: Download Document
// ======================
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found in DB' });
    }

    const fullPath = path.join(__dirname, '../uploads', document.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(fullPath);
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};
