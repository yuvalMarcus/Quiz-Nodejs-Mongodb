const Quiz = require('../../models/quiz');

module.exports.getFavorites = (req, res, next) => {

    const favorites = req.session.favorites || [];

    Quiz.findByIds(favorites).then(quizzes => {
        res.render('site/favorites.ejs', {
            pageTitle: 'Quiz',
            path: '/',
            quizzes: quizzes
        });
    }).catch();
};

module.exports.addFavorite = (req, res, next) => {

    const body = req.body;

    if(!Array.isArray(req.session.favorites)) {

        req.session.favorites = [];
    }

    if(req.session.favorites.findIndex(cur => cur === body.id) === -1) {

        req.session.favorites.push(body.id);
    }

    req.session.save(err => {
        res.redirect(body.url);
    });
};

module.exports.removeFavorite = (req, res, next) => {

    const body = req.body;

    if(!Array.isArray(req.session.favorites)) {
        req.session.save(err => {
            res.redirect(body.url);
        });
    }

    req.session.favorites = req.session.favorites.filter(cur => cur != body.id);

    req.session.save(err => {
        res.redirect(body.url);
    });
};