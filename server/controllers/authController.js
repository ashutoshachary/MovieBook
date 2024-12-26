const User = require('../models/User');
const jwt = require('jsonwebtoken');




// In-memory blacklist (use Redis for a scalable solution)
const tokenBlacklist = new Set();

// Logout user


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    // console.log(user);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token is required for logout' });
  }

  try {
    // Decode token to verify its validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add token to blacklist
    tokenBlacklist.add(token);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token', error: error.message });
  }
};

// Middleware to check for blacklisted tokens
exports.isBlacklisted = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token has been invalidated, please log in again' });
  }

  next();
};


// recently added validatetoken
exports.validateToken = async (req, res) => {
  try {
    // Check if token exists
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ valid: false });
    }

    // Find user to ensure they still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ valid: false });
    }

    // Additional checks can be added here (e.g., user active status)
    res.json({ 
      valid: true,
      userId: user._id,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    // Token verification failed
    res.status(401).json({ valid: false });
  }
};

// Add to your auth routes
