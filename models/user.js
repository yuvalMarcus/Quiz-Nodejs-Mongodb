const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

module.exports = class User {
    constructor(id, username = null, email = null, password = null, roles = []) {
        this._id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.db = getDb();
    }

    add() {
        return this.db.collection('user').insertOne({
            username: this.username,
            email: this.email,
            password: this.password,
            roles: this.roles
        });
    }

    save() {
        return this.db.collection('user').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {
                username: this.username,
                email: this.email,
                password: this.password,
                roles: this.roles
            }});
    }

    delete() {
        return this.db.collection('user').deleteOne({_id: new mongodb.ObjectId(this._id)});
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('user').find().toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('user').find({_id: new mongodb.ObjectId(id)}).toArray();
    }

    static findByEmail(email) {
        const db = getDb();
        return db.collection('user').find({email: email}).toArray();
    }

    static fetchAllByRoles(id) {
        const db = getDb();
        return db.collection('user').find({categories: new mongodb.ObjectId(id)}).toArray();
    }
}