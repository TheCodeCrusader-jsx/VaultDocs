exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    // Basic field check
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already registered' });
      }
  
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
  
      res.status(201).json({ message: 'Signup successful', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  