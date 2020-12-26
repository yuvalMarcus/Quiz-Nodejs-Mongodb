const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

module.exports = class Category {
    constructor(id, name = null, description = null, categories = [], photo = null) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.categories = categories;
        this.photo = photo;
        this.db = getDb();
    }

    add() {
        return this.db.collection('category').insertOne({
            name: this.name,
            description: this.description,
            categories: this.categories,
            photo: this.photo
        });
    }

    save() {
        return this.db.collection('category').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {
                name: this.name,
                description: this.description,
                categories: this.categories,
                photo: this.photo
            }});
    }

    delete() {
        return this.db.collection('category').deleteOne({_id: new mongodb.ObjectId(this._id)});
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('category').find().toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('category').find({_id: new mongodb.ObjectId(id)}).toArray();
    }

    static findByIds(ids) {
        const db = getDb();
        return db.collection('category').find({_id: { $in: ids }}).toArray();
    }

    static fetchAllByCategory(id) {
        const db = getDb();
        return db.collection('category').find({categories: new mongodb.ObjectId(id)}).toArray();
    }
}