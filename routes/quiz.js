const express = require('express');

const router = express.Router();

const quizController = require('../controllers/site/quiz');

router.get('/quizzes', quizController.getQuizzes);

router.get('/quiz/:id', quizController.getQuiz);

router.post('/quiz', quizController.postQuiz);

module.exports = router;