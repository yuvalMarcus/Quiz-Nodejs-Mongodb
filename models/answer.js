const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

module.exports = class Answer {
    constructor(id, answer = null, correct = false) {
        this._id = id;
        this.answer = answer;
        this.correct = correct;
        this.db = getDb();
    }

    add() {
        return this.db.collection('answer').insertOne({
            answer: this.answer,
            correct: this.correct
        });
    }

    save() {
        return this.db.collection('answer').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {
                answer: this.answer,
                correct: this.correct
            }});
    }

    delete() {
        return this.db.collection('answer').deleteOne({_id: new mongodb.ObjectId(this._id)});
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('answer').find().toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('answer').find({_id: new mongodb.ObjectId(id)}).toArray();
    }

    static findByIds(ids) {
        const db = getDb();
        return db.collection('answer').find({_id: { $in: ids }}).toArray();
    }

}