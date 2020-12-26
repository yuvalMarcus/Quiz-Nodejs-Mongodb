const Category = require('../../models/category');
const mongodb = require('mongodb');

module.exports.getCategories = (req, res, next) => {

    Category.fetchAll().then(categories => {
        res.render('admin/categories.ejs', {
            pageTitle: 'Categories',
            path: '/',
            categories: categories
        });
    }).catch();
};

module.exports.getAddCategory = (req, res, next) => {

    Category.fetchAll().then(categories => {

        res.render('admin/add-category.ejs', {
            pageTitle: 'Category',
            path: '/add-category',
            categories: categories
        });
    });
};

module.exports.postAddCategory = (req, res, next) => {

    const body = req.body;

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

    const category = new Category(
        null,
        body.name,
        body.description,
        categories,
        body.photo);

    category.add().then(category => {
        res.redirect('/admin');
    });
};

module.exports.getEditCategory = (req, res, next) => {

    const categoryId = req.params.categoryId;

    let allCategories = [];

    Category.fetchAll().then(categories => {

        allCategories = [...categories];

        return Category.findById(categoryId);
    }).then(category => {

        res.render('admin/edit-category.ejs', {
            pageTitle: 'Answer',
            path: '/category',
            categoryId: categoryId,
            category: category[0],
            categories: allCategories
        });
    }).catch();
};

module.exports.postEditCategory = (req, res, next) => {

    const body = req.body;

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

    const category = new Category(
        body.categoryId,
        body.name,
        body.description,
        categories,
        body.photo);

    category.save().then(category => {
        res.redirect('/admin');
    });

};

module.exports.postDeleteCategory = (req, res, next) => {

    const body = req.body;

    const category = new Category(
        body.categoryId
    );

    category.delete().then(() => {
        res.redirect('/admin');
    });
};