const Media = require('../../models/media');

module.exports.getMedia = (req, res, next) => {

    Media.fetchAll().then(items => {

        res.render('admin/media.ejs', {
            pageTitle: 'Quiz',
            path: '/',
            items: items
        });
    }).catch();
};

module.exports.getAddItem = (req, res, next) => {

    res.render('admin/media-add-item.ejs', {
        pageTitle: 'Quiz',
        path: '/',
        errors: []
    });
};

module.exports.postAddItem = (req, res, next) => {

    const image = req.file;

    console.log(image);

    const item = new Media(null, image.filename, '/uploads/', image.mimetype, image.size);

    item.add().then(item => {
        res.redirect('/admin/media');
    }).catch();
}