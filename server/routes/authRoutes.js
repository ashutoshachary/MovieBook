const express = require('express');
const { register, login,logout, validateToken } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', register);

// Login an existing user
router.post('/login', login);
router.post('/logout', logout);

router.get('/validate', authMiddleware, validateToken);



module.exports = router;
