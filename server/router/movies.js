const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { movieController } = require('../controllers');

router.get('/search/:query', auth(), movieController.searchMovies);
router.get('/play/:id', movieController.playMovie);

module.exports = router;