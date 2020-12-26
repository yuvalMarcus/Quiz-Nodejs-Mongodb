const mongodb = require('mongodb');
const { validationResult } = require('express-validator');
const Category = require('../../models/category');
const Quiz = require('../../models/quiz');
const Question = require('../../models/question');
const Answer = require('../../models/answer');
const Media = require('../../models/media');

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

        res.render('admin/quiz.ejs', {
            pageTitle: 'Quiz',
            path: '/quiz',
            quiz: data
        });
    }).catch();
};

module.exports.getQuizzes = (req, res, next) => {

    let data;

    Quiz.fetchAll().then(quizzes => {

        data = quizzes;

        return Promise.all(data.map(quiz => {
            return Category.findByIds(quiz.categories)
                .then((categories) => {
                    quiz.categories = categories;
                    return quiz;
                });
        }));
    }).then(() => {
        res.render('admin/quizzes.ejs', {
            pageTitle: 'Quiz',
            path: '/',
            quizzes: data
        });
    }).catch();
};

module.exports.getAddQuiz = (req, res, next) => {

    Category.fetchAll().then(categories => {

        res.render('admin/add-quiz.ejs', {
            pageTitle: 'Quiz',
            path: '/quiz',
            categories: categories,
            errors: [],
            quiz: {
                name: '',
                description: '',
                categories: [],
                level: 'beginners'
            }
        });
    }).catch(err => {
        next(err);
    });
};

module.exports.postAddQuiz = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    Category.fetchAll().then(allCategories => {

        let categories = [];

        if(body.categories !== undefined) {

            if(typeof body.categories === 'string') {

                categories.push( new mongodb.ObjectId(body.categories));
            }
            if(typeof body.categories === 'object') {

                for(let i = 0; i < body.categories.length; i++) {

                    categories.push( new mongodb.ObjectId(body.categories[i]));
                }
            }
        }

        if(errors.length === 0) {

            const quiz = new Quiz(
                null,
                body.name,
                body.description,
                '',
                categories,
                body.level
            );

            quiz.add().then(quiz => {
                res.redirect('/admin/quiz/' + quiz.ops[0]._id);
            });
        } else {
            res.render('admin/add-quiz.ejs', {
                pageTitle: 'Quiz',
                path: '/quiz',
                categories: allCategories,
                errors: errors,
                quiz: {
                    name: body.name,
                    description: body.description,
                    categories: categories,
                    level: body.level
                }
            });
        }
    }).catch(err => {
        next(err)
    });
};

module.exports.getEditQuiz = (req, res, next) => {

    const id = req.params.id;

    let allCategories;

    Category.fetchAll().then(categories => {

        allCategories = [...categories];

        return Quiz.findById(id);
    }).then(quiz => {

        res.render('admin/edit-quiz.ejs', {
            pageTitle: 'Quiz',
            path: '/quiz',
            categories: allCategories,
            errors: [],
            quiz: quiz[0]
        });
    }).catch(err => {
        next(err);
    });
};

module.exports.postEditQuiz = (req, res, next) => {

    const errors = validationResult(req).array();

    const body = req.body;

    Category.fetchAll().then(allCategories => {

        let categories = [];

        if(body.categories !== undefined) {

            if(typeof body.categories === 'string') {

                categories.push( new mongodb.ObjectId(body.categories));
            }
            if(typeof body.categories === 'object') {

                for(let i = 0; i < body.categories.length; i++) {

                    categories.push( new mongodb.ObjectId(body.categories[i]));
                }
            }
        }

        if(errors.length === 0) {

            const quiz = new Quiz(
                body.id,
                body.name,
                body.description,
                body.photo,
                categories,
                body.level
            );

            quiz.save().then(() => {
                res.redirect('/admin/quizzes');
            });
        } else {

            res.render('admin/edit-quiz.ejs', {
                pageTitle: 'Quiz',
                path: '/quiz',
                categories: allCategories,
                errors: errors,
                quiz: {
                    _id: body.id,
                    name: body.name,
                    description: body.description,
                    categories: categories,
                    level: body.level
                }
            });
        }

    }).catch(err => {
        next(err)
    });
};

module.exports.postDeleteQuiz = (req, res, next) => {

    const body = req.body;

    const quiz = new Quiz(
        body.id
    );

    quiz.delete().then(() => {
        res.redirect('/admin/quiz/' + body.id);
    }).catch(err => {
        next(err);
    });
};

module.exports.getImageQuiz = (req, res, next) => {

    const quizId = req.params.quizId;

    Media.fetchAll().then(items => {

        res.render('admin/set-image-quiz.ejs', {
            pageTitle: 'Quiz',
            path: '/quiz',
            items: items,
            quizId: quizId,
        });
    }).catch(err => {
        next(err);
    });
};

module.exports.postImageQuiz = (req, res, next) => {

    const body = req.body;

    let imageUrl = null;

    Media.findById(body.quizImage).then(image => {

        imageUrl = image[0].path + image[0].name;

        return Quiz.findById(body.quizId);

    }).then(quiz => {

        const quizU = new Quiz(
            quiz[0]._id,
            quiz[0].name,
            quiz[0].description,
            imageUrl,
            quiz[0].categories,
            quiz[0].level,
            quiz[0].questions);

        return quizU.save();

    }).then(result => {

        res.redirect('/admin/quiz/' + body.quizId);
    }).catch(err => {
        next(err);
    });

    console.log(body);
}