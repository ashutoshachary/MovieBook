const express = require('express');
const { addMovie, deleteMovie, getAllMovies,getMovieById, searchMovies } = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Add a new movie (Superuser only)
router.get('/search', searchMovies); 
router.post('/add', authMiddleware, roleMiddleware('superuser'), addMovie);

// Delete a movie (Superuser only)
router.delete('/delete/:id', authMiddleware, roleMiddleware('superuser'), deleteMovie);

router.get('/', getAllMovies);

router.get('/:id', getMovieById);



module.exports = router;
