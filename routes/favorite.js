const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/site/favorite');

router.get('/favorites', favoriteController.getFavorites);

router.post('/add-favorite-quiz', favoriteController.addFavorite);

router.post('/remove-favorite-quiz', favoriteController.removeFavorite);

module.exports = router;