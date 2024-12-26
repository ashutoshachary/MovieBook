const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  Source: { type: String, required: true },
  Value: { type: String, required: true },
});

const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true , index: true},
  Year: { type: String, required: true },
  Rated: { type: String, required: true },
  Released: { type: String, required: true },
  Runtime: { type: Number, required: true }, // Stored in minutes
  Genre: { type: [String], required: true }, // Array of genres
  Director: { type: String, required: true },
  Writer: { type: String, required: true },
  Actors: { type: [String], required: true }, // Array of actors
  Plot: { type: String, required: true },
  Language: { type: [String], required: true }, // Array of languages
  Country: { type: [String], required: true }, // Array of countries
  Awards: { type: String, required: true },
  Poster: { type: String, required: true },
  Ratings: [ratingSchema], // Nested schema for ratings
  Metascore: { type: String, required: true },
  imdbRating: { type: String, required: true },
  imdbVotes: { type: String, required: true },
  Type: { type: String, required: true ,index: true},
  DVD: { type: String, required: true },
  BoxOffice: { type: String, required: true },
  Production: { type: String, required: true },
  Website: { type: String, required: true },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
