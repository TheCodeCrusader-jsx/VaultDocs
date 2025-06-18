const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// POST: Upload document
exports.uploadDocument = async (req, res) => {
  console.log('--- UPLOAD DOCUMENT START ---');
  try {
    console.log('Request body:', req.body);
    console.log('Request file (in memory):', req.file);
    const { name, email, docType } = req.body;

    if (!req.file) {
      console.log('No file uploaded, sending 400.');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Manually handle file saving from memory
    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadsDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, filename);

    console.log(`Ensuring directory exists: ${uploadsDir}`);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    console.log(`Writing file to: ${filePath}`);
    fs.writeFileSync(filePath, req.file.buffer);
    console.log('File written to disk successfully.');

    console.log('Creating new document...');
    const document = new Document({
      name,
      email,
      docType,
      filePath: filename // Save just the filename
    });

    console.log('Document object created:', document);
    console.log('Attempting to save document...');
    await document.save();
    console.log('Document saved successfully.');

    res.status(201).json({ message: 'Document uploaded successfully', document });
    console.log('--- UPLOAD DOCUMENT END ---');
  } catch (error) {
    console.error('!!! ERROR IN UPLOAD DOCUMENT !!!', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// GET: All documents
exports.getDocuments = async (req, res) => {
  try {
    const { documentType } = req.query;
    const filter = documentType ? { documentType } : {};

    const documents = await Document.find(filter).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
};

// PUT: Update verified status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const document = await Document.findByIdAndUpdate(id, { verified }, { new: true });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    res.json({ message: 'Status updated', document });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// GET: Download document
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '../uploads', document.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};
