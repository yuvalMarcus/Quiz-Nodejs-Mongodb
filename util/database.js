const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    mongodb.MongoClient.connect("mongodb+srv://mongoDB1:1234@cluster0.ywkmk.mongodb.net/quizzes?retryWrites=true&w=majority&useUnifiedTopology=true").then(client => {
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
