const Quiz = require('../../models/quiz');

module.exports.getIndex = (req, res, next) => {

    Quiz.fetchAll().then(quizzes => {
        res.render('admin/index.ejs', {
            pageTitle: 'Quiz',
            path: '/',
            quizzes: quizzes
        });
    }).catch();
};