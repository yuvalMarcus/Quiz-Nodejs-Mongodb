const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    mongodb.MongoClient.connect("").then(client => {
        _db = client.db('quizzes');
        callback(client);
    }).catch(err => {

    });
};

const getDb = () => {
    return _db;
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
