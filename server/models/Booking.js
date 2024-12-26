const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    seats: { type: [Number], required: true }, // Array of seat numbers
    status: { type: String, default: 'booked' }, 
    // Track booking status
    namesAndSICs: { 
      type: [[String]], // Array of arrays, each containing [name, sic]
      validate: {
        validator: function(arr) {
          return arr.every(item => Array.isArray(item) && item.length === 2);
        },
        message: 'Each item must be an array of two strings: [name, sic].'
      }
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;   
