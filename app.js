const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer  = require('multer');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');
const mongo = require('./util/database');

const app = express();
const csrfProtection = csrf({});
const fileStoreOptions = {};
//const { validationResult } = require('express-validator');

const isAuth = require('./middleware/is-auth');
const site = require('./routes/site');
const quiz = require('./routes/quiz');
const category = require('./routes/category');
const favorite = require('./routes/favorite');

const admin = require('./routes/admin');
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', './views');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'dvbe04hf30fbdc0qwjsx3ndubc32fhsbc0',
    resave: false,
    saveUninitialized: false,
    store: new FileStore(fileStoreOptions)
}));

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(errorController.get404);

app.use(site);
app.use(quiz);
app.use(category);
app.use(favorite);
app.use('/admin', isAuth, admin);

app.use(errorController.get404);

app.use(errorController.get500);

mongo.mongoConnect(client => {

    app.listen('4000');
});