const { body } = require('express-validator');
const Quiz = require('../models/quiz');

module.exports.name = body('name', 'Please enter a quiz name with at least 4 characters.')
    .isString()
    .isLength({ min: 4, max: 20 })
    .custom((name, { req }) => {
        return Quiz.findByName(name).then(quiz => {
            const quizNameExist = req.body.name ? req.body.name : null ;
            if(quizNameExist !== name && quiz.length > 0) {
                return Promise.reject('Please enter a quiz name that does not already exist.');
            }
        })
    });

module.exports.description = body('description', 'Please enter a description.')
    .isString()
    .isLength({ min: 4, max: 200 });

module.exports.categories = body('categories', 'Not valid categories')
    .isArray();

module.exports.level = body('level', 'Please select the quiz level')
    .isString()
    .isLength({ min: 4, max: 20 });