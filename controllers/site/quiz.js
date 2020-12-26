const Quiz = require('../../models/quiz');
const Question = require('../../models/question');
const Answer = require('../../models/answer');
const Category = require('../../models/category');

module.exports.getQuiz = (req, res, next) => {

    const id = req.params.id;

    let data = null;

    Quiz.findById(id).then(quiz => {

        data = quiz[0];

        return Question.findByIds(data.questions);
    }).then(questions => {

        data.questions = questions;

        return Promise.all(data.questions.map(question => {
            return Answer.findByIds(question.answers)
                .then((answers) => {
                    question.answers = answers;
                    return question;
                });
        }));

    }).then(() => {

        return Category.findByIds(data.categories);

    }).then(categories => {

        data.categories = categories;

        res.render('site/quiz.ejs', {
            pageTitle: 'Quiz',
            path: '/quiz',
            quiz: data,
            favorites: req.session.favorites ? req.session.favorites : [],
            url: req.originalUrl
        });
    }).catch();
};

module.exports.postQuiz = (req, res, next) => {

    const id = req.body.quizId;

    let data = null;

    Quiz.findById(id).then(quiz => {

        data = quiz[0];

        return Question.findByIds(data.questions);
    }).then(questions => {

        data.questions = questions;

        return Promise.all(data.questions.map(question => {
            return Answer.findByIds(question.answers)
                .then(answers => {
                    question.answers = [];
                    for(let i = 0; i < answers.length; i++) {
                        if(answers[i].correct == 'true') {
                            question.answers.push(answers[i]);
                        }
                    }
                    return question;
                });
        }));

    }).then(() => {

        let result = {};

        for(let i = 0; i < data.questions.length; i++) {

            if(data.questions[i].type === 'one') {

                if(req.body[data.questions[i]._id + '_answer'] !== undefined && data.questions[i].answers[0]._id.toString() === req.body[data.questions[i]._id + '_answer'].toString()) {

                    result[data.questions[i]._id] = true;
                } else {
                    result[data.questions[i]._id] = false;
                }
            }
            if(data.questions[i].type === 'multi') {

                if(typeof req.body[data.questions[i]._id + '_answers'] === 'string') {

                    if(data.questions[i].answers.length === 1 && data.questions[i].answers[0]._id.toString() === req.body[data.questions[i]._id + '_answers'].toString()) {

                        result[data.questions[i]._id] = true;
                    } else {
                        result[data.questions[i]._id] = false;
                    }
                }
                if(typeof req.body[data.questions[i]._id + '_answers'] === 'object') {

                    if(JSON.stringify(data.questions[i].answers.sort()) === JSON.stringify(req.body[data.questions[i]._id + '_answers'].sort())) {

                        result[data.questions[i]._id] = true;
                    } else {
                        result[data.questions[i]._id] = false;
                    }
                }
            }
        }

        res.render('site/result.ejs', {
            pageTitle: 'Quiz',
            path: '/quiz',
            quiz: data,
            result: result
        });

    }).catch();
};

module.exports.getQuizzes = (req, res, next) => {

    Quiz.fetchAll().then(quizzes => {
        res.render('site/quizzes.ejs', {
            pageTitle: 'Quiz',
            path: '/',
            quizzes: quizzes,
            favorites: req.session.favorites ? req.session.favorites : [],
            url: req.originalUrl
        });
    }).catch();
};