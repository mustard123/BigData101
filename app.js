const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
let bodyparser = require('body-parser');
let requestTime = require('./middleware/request-time');
let db;
let dbName = 'bigdata101';
let port = process.env.PORT || 3000;
let mongoConnectionString;

if (process.env.LOCAL === 'true'){
    mongoConnectionString= 'mongodb://localhost:27017';
    console.log('Trying to use local database');
}
else {
    mongoConnectionString = 'mongodb://bduser:bduser101@ds151355.mlab.com:51355/bigdata101'
}

MongoClient.connect(mongoConnectionString, function (err, client) {
    if(err){
        throw err
    }
    else {
        db = client.db(dbName);
        console.log("Database connected!");
    }
});

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(requestTime);

function checkAuthorization(req, res, next) {
    if (req.get('Authorization') === 'mDaRAHngPI25LAUhCH0NxjWZeFh7g891') {
        next();    }
    else {
        res.status(401).send('Not authorized');
    }
}

app.get('/api/articles', (req, res) =>{
    db.collection('articles').find({}).toArray((err, result)=>{
        if (err){
            console.log('There was an error fetching from the database');
            res.sendStatus(500);
        }
        else {
            res.send(result);
        }
    })
});

app.get('/hi', (req,res) => {
    console.log(req.requestTime);
    res.send(req.requestTime.toString());
});

app.get('/api/articles/:articleId', (req, res) =>{
    let articleId = req.params.articleId;
    db.collection('articles').find({"_id": mongo.ObjectId(articleId)}).toArray((err, result)=>{
        if (err){
            console.log('There was an error fetching from the database');
            res.sendStatus(500)
        }
        else {
            res.send(result)
        }
    })
});

app.post('/api/articles', (req, res, next)=>{
    if (req.body.pwd !== '123'){
        return res.status(401).send('wrong password')
    }
    else next();

});

app.post('/api/articles', (req, res) => {
    console.log(req.body);
    let articleObject = req.body.articleObject;
    if(articleObject.length === 0 || articleObject.article === '') {
        console.log('empty');
        return res.status(400).send('empty');
    }
    else {
        let article = articleObject;
        article.requestTime = req.requestTime;
        db.collection('articles').insertOne(article, (err, insertedObject) =>{
            if (err){
                console.log('Error inserting into database');
                res.sendStatus(500);
            }
            else {
                res.status(201).send(insertedObject.insertedId);
            }
        });
    }
});

app.put('/api/articles/:articleId', checkAuthorization);
app.put('/api/articles/:articleId', (req, res)=> {
    let articleId = req.params.articleId;
    db.collection('articles').findOneAndUpdate({"_id": mongo.ObjectId(articleId)}, {"$set":{"article":req.body.article, "updatedOn":req.requestTime}}, (err ,result)=> {
        if(err){
            console.log(err);
            console.log("Something went wrong updating");
            res.sendStatus(500)
        }
        else {
            res.sendStatus(200);
        }
    })
});

app.delete('/api/articles/:articleId', checkAuthorization);
app.delete('/api/articles/:articleId', (req, res) => {
    let articleId = req.params.articleId;
    db.collection('articles').deleteOne({"_id": mongo.ObjectId(articleId)}, function (err, result) {
        if(err){
            console.log('Error deleting article');
            res.sendStatus(500);
        }
        else {
            res.sendStatus(200);
        }
    });
});

app.get('/api/dropdatabase', (req,res)=>{
    if (req.get('Authorization')==='s3bWhKajA5javJCLmT3NFK7GlIw8oGr8'){
        db.dropDatabase(function (err,result) {
            if(err){
                console.log('Error dropping database');
                res.status(500).send('Error dropping database');
            }
            else {
                console.log('Database dropped');
                res.status(200).send('Database dropped');
            }
        });
    }
    else {
        res.status(401).send('Not authorized');
    }
});

app.listen(port, function () {
    console.log("Server listening on port", port);
});