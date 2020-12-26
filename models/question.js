const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const Answer = require('./answer');

module.exports = class Question {
    constructor(id, question = null, type = null) {
        this._id = id;
        this.question = question;
        this.type = type;
        this.db = getDb();
    }

    add() {
        return this.db.collection('question').insertOne({
            question: this.question,
            type: this.type,
            answers: []
        });
    }

    save() {
        return this.db.collection('question').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {
                question: this.question,
                type: this.type
            }});
    }

    delete() {

        const question = Question.findById(this._id);

        return this.db.collection('question').deleteOne({_id: new mongodb.ObjectId(this._id)}).then(() => {

            return question;
        }).then(question => {

            const answers = question[0].answers;

            for (let i = 0, p = Promise.resolve(); i < answers.length; i++) {
                p = p.then(_ => new Promise(resolve => {
                        new Answer(answers[i]).delete().then(() => {
                            resolve();
                        });
                    }
                ));
            }
        });
    }

    addAnswer(id) {

        let answers = null;

        return this.db.collection('question').find({_id: new mongodb.ObjectId(this._id)}).toArray().then(questions => {

            answers = questions[0].answers;

            answers.push(id);

            return this.db.collection('question').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {
                    answers: answers,
                }});

        });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('question').find({_id: new mongodb.ObjectId(id)}).toArray();
    }

    static findByIds(ids) {
        const db = getDb();
        return db.collection('question').find({_id: { $in: ids }}).toArray();
    }
}