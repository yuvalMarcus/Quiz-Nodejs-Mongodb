const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

module.exports = class Image {
    constructor(id, name = null, path = null, type = null, size = null) {
        this._id = id;
        this.name = name;
        this.path = path;
        this.type = type;
        this.size = size;
        this.db = getDb();
    }

    add() {
        return this.db.collection('media').insertOne({
            name: this.name,
            path: this.path,
            type: this.type,
            size: this.size
        });
    }

    delete() {
        return this.db.collection('media').deleteOne({_id: new mongodb.ObjectId(this._id)});
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('media').find().toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('media').find({_id: new mongodb.ObjectId(id)}).toArray();
    }
}