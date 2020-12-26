const express = require('express');

const router = express.Router();

const pageController = require('../controllers/site/page');

const loginValidation = require('../validation/login');
const registerValidation = require('../validation/register');

router.get('/', pageController.getIndex);

router.get('/register', pageController.getRegister);

router.post('/register', registerValidation.username, registerValidation.email, registerValidation.password, pageController.postRegister);

router.get('/login', pageController.getLogin);

router.post('/login', loginValidation.email, loginValidation.password, pageController.postLogin);

router.post('/logout', pageController.postLogout);

module.exports = router;