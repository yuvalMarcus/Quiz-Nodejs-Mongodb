const { body } = require('express-validator');

module.exports.answer = body('answer', 'Please enter a answer.')
    .isString()
    .isLength({ min: 4, max: 100 });


module.exports.correct = body('correct', 'Please select if is correct answer.')
    .isString()
    .isLength({ min: 2, max: 20 });