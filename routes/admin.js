const express = require('express');
const router = express.Router();

const pageController = require('../controllers/admin/page');
const categoryController = require('../controllers/admin/category');
const quizController = require('../controllers/admin/quiz');
const questionController = require('../controllers/admin/question');
const answerController = require('../controllers/admin/answer');
const mediaController = require('../controllers/admin/media');

const quizValidation = require('../validation/quiz');
const questionValidation = require('../validation/question');
const answerValidation = require('../validation/answer');

router.get('/', pageController.getIndex);


router.get('/categories', categoryController.getCategories);

router.get('/add-category', categoryController.getAddCategory);

router.post('/add-category', categoryController.postAddCategory);

router.get('/edit-category/:categoryId', categoryController.getEditCategory);

router.post('/edit-category', categoryController.postEditCategory);

router.post('/delete-category', categoryController.postDeleteCategory);



router.get('/quizzes', quizController.getQuizzes);

router.get('/add-quiz', quizController.getAddQuiz);

router.post('/add-quiz', quizValidation.name, quizValidation.description, quizValidation.categories, quizValidation.level, quizController.postAddQuiz);

router.get('/edit-quiz/:id', quizController.getEditQuiz);

router.post('/edit-quiz', quizValidation.name, quizValidation.description, quizValidation.categories, quizValidation.level, quizController.postEditQuiz);

router.post('/delete-quiz', quizController.postDeleteQuiz);

router.get('/quiz/:id', quizController.getQuiz);

router.get('/image-quiz/:quizId', quizController.getImageQuiz);

router.post('/image-quiz', quizController.postImageQuiz);



router.get('/quiz/:quizId/add-question', questionController.getAddQuestion);

router.post('/quiz/:quizId/add-question', questionValidation.question, questionValidation.type, questionController.postAddQuestion);

router.get('/quiz/:quizId/edit-question/:questionId', questionController.getEditQuestion);

router.post('/quiz/:quizId/edit-question', questionValidation.question, questionValidation.type, questionController.postEditQuestion);

router.post('/quiz/:quizId/delete-question', questionController.postDeleteQuestion);



router.get('/quiz/:quizId/question/:questionId/add-answer', answerController.getAddAnswer);

router.post('/quiz/:quizId/question/:questionId/add-answer', answerValidation.answer, answerValidation.correct, answerController.postAddAnswer);

router.get('/quiz/:quizId/question/:questionId/edit-answer/:answerId', answerController.getEditAnswer);

router.post('/quiz/:quizId/question/:questionId/edit-answer', answerValidation.answer, answerValidation.correct, answerController.postEditAnswer);



router.get('/media', mediaController.getMedia);

router.get('/media/add-item', mediaController.getAddItem);

router.post('/media/add-item', mediaController.postAddItem);


module.exports = router;