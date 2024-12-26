const express = require('express');
const { getBookedSeats, bookSeats, getUserBookings, cancelBooking, getBookingById, getAllTheBookingsofaPerticularMovie } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/myBookings', authMiddleware, getUserBookings); // Fetch user's bookings
router.delete('/del/:bookingId', authMiddleware, cancelBooking); 

router.get('/:movieId', authMiddleware, getBookedSeats);
router.get('/allTheBookingofOneMovie/:movieId',authMiddleware, getAllTheBookingsofaPerticularMovie)
 // Get booked seats for a movie
router.post('/', authMiddleware, bookSeats); // Book seats (requires authentication)

router.get('/onebooking/:bookingId', authMiddleware, getBookingById); // Fetch a specific booking by id


module.exports = router;
