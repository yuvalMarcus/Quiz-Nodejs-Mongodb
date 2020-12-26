const { body } = require('express-validator');
const User = require('../models/user');

module.exports.username = body(
    'username',
    'Please enter a username with only numbers and text and at least 5 characters.')
    .isLength({ min: 5 })
    .isAlphanumeric();


module.exports.email = body('email')
    .isEmail()
    .withMessage('invalid email')
    .custom((email, { req }) => {
        return User.findByEmail(email).then(user => {
            if(user.length > 0) {
                return Promise.reject('email exist');
            }
        });
    });

module.exports.password = body(
    'password',
    'Please enter a password with only numbers and text and at least 4 characters.')
    .isLength({ min: 4 })
    .isAlphanumeric();
