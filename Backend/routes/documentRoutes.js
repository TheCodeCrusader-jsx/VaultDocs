const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ✅ Don't forget this
const {
  uploadDocument,
  getDocuments,
  updateStatus,
  downloadDocument
} = require('../controllers/documentController');

const router = express.Router();

// Use memoryStorage to debug file system issues
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// ✅ Routes

// POST Upload document
router.post('/upload', upload.single('file'), uploadDocument);

// GET All documents
router.get('/', getDocuments);

// PUT Update document status
router.put('/:id', updateStatus);

// GET Download document by ID
router.get('/:id/download', downloadDocument);

module.exports = router;
