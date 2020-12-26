const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Quiz = require('../../models/quiz');
const User = require('../../models/user');

module.exports.getIndex = (req, res, next) => {

    Quiz.fetchAll().then(quizzes => {
        if(quizzes.length > 8)
            quizzes.length = 8;
        res.render('site/index.ejs', {
            pageTitle: 'Quiz',
            path: '/',
            quizzes: quizzes,
            favorites: req.session.favorites ? req.session.favorites : [],
            url: req.originalUrl
        });
    }).catch();
};

module.exports.getRegister = (req, res, next) => {

    res.render('site/register.ejs', {
        pageTitle: 'Quiz',
        path: '/',
        errors: []
    });
};

module.exports.postRegister = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    bcrypt.hash(body.password, 12).then(passwordHash => {

        if(errors.length === 0) {

            const user = new User(
                null,
                body.username,
                body.email,
                passwordHash
            );

            user.add();

            res.redirect('/');

        } else {

            res.status(422).render('site/register.ejs', {
                pageTitle: 'Quiz',
                path: '/',
                errors: errors
            });
        }
    }).catch(err => {
        next(err);
    });
};


module.exports.getLogin = (req, res, next) => {

    res.render('site/login.ejs', {
        pageTitle: 'Quiz',
        path: '/',
        errors: []
    });
};

module.exports.postLogin = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    User.findByEmail(body.email).then(user => {

        if(user.length === 0)
            return false;

        return bcrypt.compare(body.password, user[0].password);

    }).then(isLog => {

        if(isLog) {

            req.session.isAuthenticated = true;

            req.session.save(err => {
                res.redirect('/');
            });

        } else {
            res.status(422).render('site/login.ejs', {
                pageTitle: 'Quiz',
                path: '/',
                errors: errors
            });
        }

    }).catch(err => {
        next(err);
    });
};

module.exports.postLogout = (req, res, next) => {

    req.session.isAuthenticated = false;

    req.session.save(err => {
        res.redirect('/');
    });
};
