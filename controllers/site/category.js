const Category = require('../../models/category');
const Quiz = require('../../models/quiz');

module.exports.getCategories = (req, res, next) => {

    Category.fetchAll().then(categories => {

        categories = categories.filter(category => {
            return category.categories.length === 0;
        });

        res.render('site/categories.ejs', {
            pageTitle: 'categories',
            path: '/',
            categories: categories
        });
    }).catch();
};

module.exports.getCategory = (req, res, next) => {

    const categoryId = req.params.categoryId;

    let data = {};

    Quiz.fetchAllByCategory(categoryId).then(quizzes => {

        data.quizzes = quizzes;

        return Category.fetchAllByCategory(categoryId);
    }).then(categories => {

        data.categories = categories;

        res.render('site/category.ejs', {
            pageTitle: 'category',
            path: '/',
            quizzes: data.quizzes,
            categories: data.categories,
            favorites: req.session.favorites ? req.session.favorites : [],
            url: req.originalUrl
        });
    });

};