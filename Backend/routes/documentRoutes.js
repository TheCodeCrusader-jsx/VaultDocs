
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

const router = express.Router();

// Use memoryStorage to hold files in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// ✅ Routes

// POST Upload documents (field name must match frontend: 'documents')
router.post('/upload', upload.array('documents', 10), uploadDocument); // Accept up to 10 files

// GET All documents
router.get('/', getDocuments);

// PUT Update document status
router.put('/:id', updateStatus);

// GET Download document by ID
router.get('/:id/download', downloadDocument);

module.exports = router;


