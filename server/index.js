const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('filter');
const rateLimit = require('express-rate-limit');

const db = monk('localhost/twitter');
const tweets = db.get('tweets');

const filter = new Filter();

const app = express();

app.use(cors()); //cors middleware
app.use(express.json()); //JSON body parser

app.get('/', (req, res) =>{
     res.json({
          message : 'Hello front-side'
     })
});

app.get('/tweets', (req, res) =>{
     tweets.find().then(tweets => { res .json(tweets);});
})

//ensure that the data we are passed back is not empty
function isValid(tweet){  
     return tweet.name && tweet.name.toString().trim() !== ' ' && 
     tweet.comment && tweet.comment.toString().trim() !== ' '; 
}

//rate limit only creating tweets but enabling it before making our post
app.use(rateLimit({
     windowsMS: 30 * 1000,  //30s
     max: 1
}));

app.post('/tweets', (req, res) => {
     if(isValid(req.body)){
          //push to our DB
          const tweet = {
               //create an object of the tweet. use toString() so there is no injection
               name: filter.clean(req.body.name.toString()),
               tweet: filter.clean(req.body.comment.toString()),
               created: new Date()
          };
          //insert the above tweet into our DB, once inserted, respond what was sent back;
          tweets.insert(tweet).then(createdTweet => {
               res.json(createdTweet);
          });
     } else {
          res.status(422);
          res.json({
               message: "Please enter in your name and tweet"
          });
     }
})

app.listen(5000, () => {
     console.log('server is listening on http://locahost:5000');
})