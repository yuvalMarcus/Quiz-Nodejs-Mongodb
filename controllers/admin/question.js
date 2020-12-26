const { validationResult } = require('express-validator');
const Quiz = require('../../models/quiz');
const Question = require('../../models/question');

module.exports.getAddQuestion = (req, res, next) => {

    const quizId = req.params.quizId;

    res.render('admin/add-question.ejs', {
        pageTitle: 'Question',
        path: '/quiz',
        errors: [],
        quizId: quizId,
        question: {
            question: '',
            type: 'one'
        }
    });
};

module.exports.postAddQuestion = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    if(errors.length === 0) {

        const quiz = new Quiz(
            body.quizId
        );

        const question = new Question(null, body.question, body.type);

        question.add().then(question => {

            return quiz.addQuestion(question.ops[0]._id);
        }).then(quiz => {
            res.redirect('/admin/quiz/' + body.quizId);
        }).catch(err => {
            next(err);
        });

    } else {

        res.render('admin/add-question.ejs', {
            pageTitle: 'Question',
            path: '/quiz',
            errors: errors,
            quizId: body.quizId,
            question: {
                question: body.question,
                type: body.type
            }
        });
    }
};

module.exports.getEditQuestion = (req, res, next) => {

    const quizId = req.params.quizId;
    const questionId = req.params.questionId;

    Question.findById(questionId).then(question => {
        res.render('admin/edit-question.ejs', {
            pageTitle: 'Question',
            path: '/question',
            errors: [],
            quizId: quizId,
            question: question[0]
        });
    }).catch(err => {
        next(err);
    });
};

module.exports.postEditQuestion = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    if(errors.length === 0) {

        const question = new Question(
            body.questionId,
            body.question,
            body.type
        );

        question.save().then(() => {
            res.redirect('/admin/quiz/' + body.quizId);
        }).catch(err => {
            next(err);
        });

    } else {
        res.render('admin/edit-question.ejs', {
            pageTitle: 'Question',
            path: '/question',
            errors: errors,
            quizId: body.quizId,
            question: {
                question: body.question,
                type: body.type
            }
        });
    }
};

module.exports.postDeleteQuestion = (req, res, next) => {

    const body = req.body;

    const question = new Question(
        body.questionId
    );

    question.delete().then(() => {
        res.redirect('/admin/quiz/' + body.quizId);
    }).catch(err => {
        next(err);
    });
};