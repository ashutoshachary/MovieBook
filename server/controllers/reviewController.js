const Review = require('../models/Review');
const Movie = require('../models/Movie');

// Add a review
exports.addReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const review = await Review.create({
      user: req.user._id,
      movie: movieId,
      rating,
      comment,
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};

// Get all reviews for a specific movie
exports.getReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    const reviews = await Review.find({ movie: movieId }).populate('user', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve reviews', error: error.message });
  }
};
