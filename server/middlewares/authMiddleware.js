const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
