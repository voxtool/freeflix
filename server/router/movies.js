const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { movieController } = require('../controllers');

router.get('/search/:query', auth(), movieController.searchMovies);
router.get('/play/:id', movieController.playMovie);
router.get('/subtitles', movieController.getSubtitles);
router.get('/:pageSize/:page', auth(), movieController.getMovies);
router.post('/add', auth(), movieController.addMovie);
router.delete('/remove/:movieId', auth(), movieController.deleteMovie);

module.exports = router;