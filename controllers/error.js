
module.exports.get404 = (req, res, next) => {
    res.status(404).render('error/404.ejs', {
        pageTitle: 'Page Not Found',
        path: '/404'
    });
};

module.exports.get500 = (error, req, res, next) => {
    res.status(500).render('error/500.ejs', {
        pageTitle: 'Page Not Found',
        path: '/500',
        isAuthenticated: req.session.isAuthenticated,
        csrfToken: req.csrfToken()
    });
};
