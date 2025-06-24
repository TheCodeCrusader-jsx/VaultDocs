const express = require('express');
const { searchUsers } = require('../controllers/userController');

const router = express.Router();

// GET: Search for users by username
router.get('/search', searchUsers);

module.exports = router;
