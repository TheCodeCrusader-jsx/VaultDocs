const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// =======================
// POST: Upload Documents
// =======================
exports.uploadDocument = async (req, res) => {
  console.log('--- UPLOAD DOCUMENTS START ---');

  try {
    const { name, email } = req.body;
    let docTypes = req.body.docTypes;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    if (!Array.isArray(docTypes)) {
      docTypes = [docTypes]; // Convert to array if single docType
    }

    // --- BACKEND VALIDATION ---
    const requiredDocs = ['aadhar', 'pan', 'bank', 'marksheet'];
    const receivedDocTypes = [...new Set(docTypes)]; // Get unique doc types from request
    const missingDocs = requiredDocs.filter(doc => !receivedDocTypes.includes(doc));

    if (missingDocs.length > 0) {
      return res.status(400).json({
        message: `Missing required documents: ${missingDocs.join(', ')}`
      });
    }
    // --- END VALIDATION ---

    if (docTypes.length !== req.files.length) {
      return res.status(400).json({ message: 'Mismatch between docTypes and number of files' });
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // ✅ Clean the user's name to use in filenames
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '_');

    const groupedDocs = {
      aadhar: [], pan: [], marksheet: [], bank: []
    };

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const docType = docTypes[i].toLowerCase();

      // ✅ Construct a clear and unique filename
      // Ensure we always use .pdf extension
      const ext = '.pdf';
      const filename = `${docType}-${cleanName}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      // Create the uploads directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Save the file
      fs.writeFileSync(filePath, file.buffer);
      console.log(`✅ Saved: ${docType} → ${filename}`);
      console.log(`✅ File path: ${filePath}`);

      if (groupedDocs.hasOwnProperty(docType)) {
        groupedDocs[docType].push(filename);
      } else {
        groupedDocs.other.push(filename);
      }
    }

    const newDoc = new Document({
      name,
      email,
      documents: groupedDocs
    });

    await newDoc.save();

    res.status(201).json({
      message: `✅ ${req.files.length} documents uploaded successfully`,
      data: newDoc
    });

    console.log('--- UPLOAD DOCUMENTS END ---');
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};



// ======================
// GET: All Documents (with filters)
// ======================
exports.getDocuments = async (req, res) => {
  try {
    const { date } = req.query;
    console.log('📥 Fetching docs with:', { date });

    const filter = {};

    // Filter by date if passed
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      filter.createdAt = {
        $gte: selectedDate,
        $lt: nextDay,
      };
    }

    const documents = await Document.find(filter).sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    console.error('❌ Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
};

// ============================
// PUT: Update Verification Status
// ============================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const document = await Document.findByIdAndUpdate(id, { status }, { new: true });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Status updated', document });
  } catch (error) {
    console.error('❌ Status Update Error:', error);
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// ======================
// GET: Download Document
// ======================

exports.downloadDocument = async (req, res) => {
  const { id } = req.params;
  const { type, file } = req.query;

  console.log('🛠️ Download request received:', { id, type, file });

  if (!file || !type) {
    return res.status(400).json({ message: 'Document type and file name are required' });
  }

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found in DB' });
    }

    console.log('📦 Document found:', document.documents);

    const filesOfType = document.documents[type];

    if (!filesOfType || !filesOfType.includes(file)) {
      console.log(`❌ Mismatch! filesOfType =`, filesOfType);
      return res.status(404).json({ message: 'File not found in document records' });
    }

    // Get the full path to the uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.error('❌ Uploads directory not found:', uploadsDir);
      return res.status(500).json({ message: 'Uploads directory not found' });
    }

    // Clean the filename to match how it was saved
    const cleanName = document.name.trim().toLowerCase().replace(/\s+/g, '_');
    const ext = '.pdf'; // Always use .pdf extension
    const savedFilename = `${type}-${cleanName}${ext}`;
    
    // Construct the full file path
    const filePath = path.join(uploadsDir, savedFilename);
    console.log('🔍 Checking file at:', filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found:', filePath);
      console.error('❌ Looking for:', savedFilename);
      console.error('❌ Directory contents:', fs.readdirSync(uploadsDir));
      console.error('❌ Document record:', document.documents[type]);
      return res.status(404).json({ 
        message: 'File not found on server',
        details: {
          lookingFor: savedFilename,
          directoryContents: fs.readdirSync(uploadsDir)
        }
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    console.log('✅ File found:', { size: stats.size, modified: stats.mtime });

    // Set appropriate headers
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${file}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle errors
    fileStream.on('error', (err) => {
      console.error('❌ Error streaming file:', err);
      res.status(500).json({ message: 'Error streaming file' });
    });
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};



