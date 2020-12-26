const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/site/category');

router.get('/categories', categoryController.getCategories);

router.get('/category/:categoryId', categoryController.getCategory);

module.exports = router;