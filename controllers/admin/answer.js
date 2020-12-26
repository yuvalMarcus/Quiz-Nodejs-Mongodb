const { validationResult } = require('express-validator');
const Question = require('../../models/question');
const Answer = require('../../models/answer');

module.exports.getAddAnswer = (req, res, next) => {

    const quizId = req.params.quizId;
    const questionId = req.params.questionId;

    res.render('admin/add-answer.ejs', {
        pageTitle: 'Answer',
        path: '/quiz',
        errors: [],
        quizId: quizId,
        questionId: questionId,
        answer: {
            answer: '',
            correct: ''
        }
    });
};

module.exports.postAddAnswer = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    if(errors.length === 0) {

        const question = new Question(
            body.questionId
        );

        const answer = new Answer(null, body.answer, body.correct);

        answer.add().then(answer => {
            return question.addAnswer(answer.ops[0]._id);
        }).then(question => {
            res.redirect('/admin/quiz/' + body.quizId);
        }).catch(err => {
            next(err);
        });
    } else {
        res.render('admin/add-answer.ejs', {
            pageTitle: 'Answer',
            path: '/quiz',
            errors: errors,
            quizId: body.quizId,
            questionId: body.questionId,
            answer: {
                answer: body.answer,
                correct: body.correct
            }
        });
    }
};

module.exports.getEditAnswer = (req, res, next) => {

    const quizId = req.params.quizId;
    const questionId = req.params.questionId;
    const answerId = req.params.answerId;

    Answer.findById(answerId).then(answer => {
        res.render('admin/edit-answer.ejs', {
            pageTitle: 'Answer',
            path: '/answer',
            errors: [],
            quizId: quizId,
            questionId: questionId,
            answer: answer[0]
        });
    }).catch(err => {
        next(err);
    });
};

module.exports.postEditAnswer = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    if(errors.length === 0) {

        const answer = new Answer(
            body.answerId,
            body.answer,
            body.correct
        );

        answer.save().then(() => {
            res.redirect('/admin/quiz/' + body.quizId);
        }).catch(err => {
            next(err);
        });

    } else {
        res.render('admin/edit-answer.ejs', {
            pageTitle: 'Answer',
            path: '/answer',
            errors: errors,
            quizId: body.quizId,
            questionId: body.questionId,
            answer: {
                _id: body.answerId,
                answer: body.answer,
                correct: body.correct
            }
        });
    }
};

module.exports.postDeleteAnswer = (req, res, next) => {

    const body = req.body;

    const answer = new Answer(
        body.answerId
    );

    answer.delete().then(() => {
        res.redirect('/admin/quiz/' + body.quizId);
    }).catch(err => {
        next(err);
    });
};