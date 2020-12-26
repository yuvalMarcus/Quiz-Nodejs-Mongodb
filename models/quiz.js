const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const Question = require('./question');

module.exports = class Quiz {
    constructor(id, name = null, description = null, photo = null, categories = [], level = null) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.photo  = photo;
        this.categories = categories;
        this.level = level;
        this.db = getDb();
    }

    add() {
        return this.db.collection('quiz').insertOne({
            name: this.name,
            description: this.description,
            photo: this.photo,
            categories: this.categories,
            level: this.level,
            questions: []
        });
    }

    save() {
        return this.db.collection('quiz').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {
                name: this.name,
                description: this.description,
                photo: this.photo,
                categories: this.categories,
                level: this.level
        }});
    }

    delete() {

        const quiz = Quiz.findById(this._id);

        return this.db.collection('quiz').deleteOne({_id: new mongodb.ObjectId(this._id)}).then(() => {

            return quiz;
        }).then(quiz => {

            const questions = quiz[0].questions;

            for (let i = 0, p = Promise.resolve(); i < questions.length; i++) {
                p = p.then(_ => new Promise(resolve => {
                        new Question(questions[i]).delete().then(() => {
                            resolve();
                        });
                    }
                ));
            }
        });
    }

    addQuestion(id) {

        let questions = null;

        return this.db.collection('quiz').find({_id: new mongodb.ObjectId(this._id)}).toArray().then(quizzes => {

            questions = quizzes[0].questions;

            questions.push(id);

            return this.db.collection('quiz').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {
                    questions: questions,
                }});

        });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('quiz').find().toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('quiz').find({_id: new mongodb.ObjectId(id)}).toArray();
    }

    static findByIds(ids) {
        const db = getDb();
        const mongosIds = ids.map(id => new mongodb.ObjectId(id));
        return db.collection('quiz').find({_id: { $in: mongosIds }}).toArray();
    }

    static findByName(name) {
        const db = getDb();
        return db.collection('quiz').find({name: name}).toArray();
    }

    static fetchAllByCategory(id) {
        const db = getDb();
        return db.collection('quiz').find({categories: new mongodb.ObjectId(id)}).toArray();
    }
}