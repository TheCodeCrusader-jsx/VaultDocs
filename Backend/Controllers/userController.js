const User = require('../models/User');

// ======================
// GET: Search Users by Username
// ======================
exports.searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: 'Username query parameter is required' });
    }

    const users = await User.find({
      name: { $regex: new RegExp(username, 'i') },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error searching users:', error);
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};
