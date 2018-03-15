const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
let bodyparser = require('body-parser');
let requestTime = require('./middleware/request-time');
let db;
let dbName = 'bigdata101';

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
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

app.get('/api/articles', (req, res) =>{
    db.collection('articles').find({}).toArray((err, result)=>{
        if (err){
            console.log('There was an error fetching from the database');
            res.sendStatus(500)
        }
        else {
            res.send(JSON.stringify(result))
        }
    })
});

app.get('/hi', (req,res) => {
    console.log(req.requestTime)
    res.send(req.requestTime);
});

app.get('/api/articles/:articleId', (req, res) =>{
    let articleId = parseInt(req.params.articleId);
    db.collection('articles').find({"articleId": articleId}).toArray((err, result)=>{
        if (err){
            console.log('There was an error fetching from the database');
            res.sendStatus(500)
        }
        else {
            res.send(JSON.stringify(result))
        }
    })
});

app.post('/api/articles', (req, res) => {
    console.log(req.body);
    if(req.body.length === 0){
        console.log('empty');
        return res.statusCode(300).send('empty');
    }
    else {
        let article = req.body;
        article.requestTime = req.requestTime;
        db.collection('articles').insertOne(article);
    }


});

app.delete('api/articles/:articleId', (req, res) => {
    let articleID = parseInt(req.params.articleId);
    db.collection('articles').deleteOne({"articleId": articleID})
    res.sendStatus(200);
})


app.listen(3000, function () {
    console.log("Server listening on port 3000!");
});