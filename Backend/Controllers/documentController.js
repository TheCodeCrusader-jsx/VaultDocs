const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    const { name, email, docType } = req.body;
    
    // Validate docType
    if (!['aadhar', 'pan', 'passport', 'license', 'other'].includes(docType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid document type. Must be one of: aadhar, pan, passport, license, other' });
    }

    const filePath = req.file.path;
    const newDoc = new Document({ name, email, docType, filePath });
    await newDoc.save();

    res.status(201).json({ message: 'Document uploaded successfully', document: newDoc });
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { docType, status } = req.query;
    const filter = {};

    if (docType) {
      filter.docType = docType.toLowerCase();
    }
    if (status) {
      if (!['pending', 'verified', 'rejected'].includes(status.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: pending, verified, rejected' });
      }
      filter.status = status.toLowerCase();
    }

    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', document: doc });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const filePath = path.resolve(doc.filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: 'Download failed' });
  }
};
