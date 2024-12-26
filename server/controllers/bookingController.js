const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');



exports.getBookedSeats = async (req, res) => {
  const { movieId } = req.params;

  try {
    const bookings = await Booking.find({ movie: movieId });
    const bookedSeats = bookings.flatMap((booking) => booking.seats);

    res.status(200).json({ bookedSeats });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Error fetching booked seats', error: error.message });
  }
};



exports.bookSeats = async (req, res) => {
  const { movieId, seats, namesAndSICs } = req.body;

  try {
    // Validate the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the seats are already booked
    const existingBookings = await Booking.find({ movie: movieId });
    const alreadyBooked = existingBookings.flatMap((booking) => booking.seats);
    const isConflict = seats.some((seat) => alreadyBooked.includes(seat));

    if (isConflict) {
      return res.status(400).json({ message: 'One or more seats are already booked' });
    }

    // Validate that namesAndSICs corresponds to the number of seats
    if (!Array.isArray(namesAndSICs) || namesAndSICs.length !== seats.length) {
      return res.status(400).json({ message: 'Invalid namesAndSICs data. It must match the number of seats.' });
    }

    // Ensure each entry in namesAndSICs is a valid [name, sic] pair
    const isValidFormat = namesAndSICs.every(
      (pair) => Array.isArray(pair) && pair.length === 2 && typeof pair[0] === 'string' && typeof pair[1] === 'string'
    );
    if (!isValidFormat) {
      return res.status(400).json({ message: 'Each entry in namesAndSICs must be a [name, sic] pair.' });
    }

    // Create a new booking
    const booking = new Booking({
      user: req.user._id, // Use the user ID attached by authMiddleware
      movie: movieId,
      seats,
      namesAndSICs, // Include names and SICs in the booking
    });

    await booking.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Error booking seats', error: error.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('movie', 'title');
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error.message);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
};

exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // Find and delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully', deletedBooking });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  const { bookingId } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid Booking ID' });
  }

  try {
    // Find the movie by its ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching Booking:', error.message);
    res.status(500).json({ message: 'Failed to fetch Booking', error: error.message });
  }
};

exports.getAllTheBookingsofaPerticularMovie = async (req, res) => {
  const { movieId } = req.params;

  try {
    const bookings = await Booking.find({ movie: movieId });
    

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Error fetching booked seats', error: error.message });
  }
};




