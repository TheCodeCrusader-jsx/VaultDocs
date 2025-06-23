const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  uploadDocument,
  getDocuments,
  updateStatus,
  downloadDocument
} = require('../controllers/documentController');

const router = express.Router(); // ✅ Declare router BEFORE using it

// Multer config: use memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit per file
});

// ✅ Routes

// POST: Upload documents
router.post('/upload', upload.array('documents', 10), uploadDocument);

// GET: All documents
router.get('/', getDocuments);

// PUT: Update status
router.put('/:id', updateStatus);

// GET: Download document by ID & file
router.get('/:id/download', downloadDocument); // ✅ Works with ?type=x&file=filename.pdf

module.exports = router; // ✅ Only export ONCE
