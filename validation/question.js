const { body } = require('express-validator');

module.exports.question = body('question', 'Please enter a question.')
    .isString()
    .isLength({ min: 4, max: 100 });


module.exports.type = body('type', 'Please select the question type')
    .isString()
    .isLength({ min: 2, max: 20 });