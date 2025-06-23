const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// =======================
// POST: Upload Documents
// =======================
exports.uploadDocument = async (req, res) => {
  console.log('--- UPLOAD DOCUMENTS START ---');

  try {
    const { name, email, docType } = req.body;

    if (!req.files || req.files.length === 0) {
      console.log('❌ No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const documentPromises = req.files.map(async (file) => {
      const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, file.buffer);
      console.log('✅ File saved to:', filePath);

      const document = new Document({
        name,
        email,
        docType,
        filePath: filename,
      });

      await document.save();
      console.log('✅ Document saved to DB:', document._id);
      return document;
    });

    const savedDocuments = await Promise.all(documentPromises);

    res.status(201).json({
      message: `${savedDocuments.length} document(s) uploaded successfully`,
      documents: savedDocuments,
    });

    console.log('--- UPLOAD DOCUMENTS END ---');
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
