const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Add a review for a movie
router.post('/add', authMiddleware, addReview);

// Get all reviews for a specific movie
router.get('/:movieId', getReviews);

module.exports = router;
