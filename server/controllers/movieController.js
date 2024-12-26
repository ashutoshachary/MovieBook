const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');

// Get a movie by ID
exports.getMovieById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid movie ID' });
  }

  try {
    // Find the movie by its ID
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error.message);
    res.status(500).json({ message: 'Failed to fetch movie', error: error.message });
  }
};

// Add a new movie (Superuser only)
exports.addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);


    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
    console.error('Error adding movie:', error.message);
    res.status(500).json({ message: 'Failed to add movie', error: error.message });
  }
};


// Delete a movie (Superuser only)
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid movie ID' });
  }

  try {
    // Find and delete the movie
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    

    // Delete all associated bookings
    const deleteResult = await Booking.deleteMany({ movie: movie._id });
    console.log(`${deleteResult.deletedCount} bookings deleted`);

    res.status(200).json({ 
      message: 'Movie and associated bookings deleted successfully',
      deletedBookingsCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting movie and bookings:', error);
    res.status(500).json({ message: 'Failed to delete movie and bookings', error: error.message });
  }
};


exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find(); // Fetch all movies from the database
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};

// Search movies by title and type


exports.searchMovies = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required for searching.' });
    }

    const regex = new RegExp(title, 'i'); // Case-insensitive regex for matching
    const movies = await Movie.find({ Title: regex }).select(
      'Title Year Type Poster imdbRating'
    ); // Return only required fields

    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found.' });
    }

    res.status(200).json(movies);
  } catch (error) {
    
    res.status(500).json({ message: 'Server error while searching movies.' });
  }
};