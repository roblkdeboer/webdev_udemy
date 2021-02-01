//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { request } = require("express");

const app = express();

// Use EJS for templating
app.set('view engine', 'ejs');

// Use body parser to parse requests
app.use(bodyParser.urlencoded({
  extended: true
}));
// Use public directory to store public files like images
app.use(express.static("public"));

// Connect to wikiDB on local mogoose server
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true, useUnifiedTopology: true});

// Set up the schema for the specific collection
const articleSchema = {
    title: String,
    content: String
};

// Set up the inserting into the article collection
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////////////////////////REQUESTS POINTING ALL ARTICLES///////////////////////////////////////////////////////////////////////////////////////

app.route("/articles")

    .get(function (req, res) {
    //If we access localhost:3000/articles, this executes to get all articles from the DB
    // Leave the first condition empty as we have no search parameters
    Article.find(function (err, foundArticles) {
        if (!err) {
            // Send foundArticles to the web browser
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

    .post(function (req, res) {
    // Post requests should go to a collection or resources
    // Post data to the Article schema when accessing this route
    // The name attributes of the HTML form is where these will come from
    // Constant gets saved into the article in the DB
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    // If no error, send a response saying article added.  If error, send the error
    newArticle.save(function (err) {
        if (!err) {
            res.send("Successfully added a new article");
        } else {
            res.send(err);
        }
    });
})

    .delete(function (req, res) {
    // Delete all articles in the DB
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("All articles deleted successfully");
        } else {
            res.send(err);
        }
    });
});

///////////////////////////////////////////////////////////////REQUESTS TARGETING SPECIFIC ARTICLES///////////////////////////////////////////////////////////////////////////////////////

// Use the : as a route parameter to allow the client to make a specific request
app.route("/articles/:articleTitle")

    // title of article will be tagged to the specified route (articleTitle)
    // Find one document where the title = articleTitle
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, 
            function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found!");
            }
        });
    })

    .put(function (req, res) {
        Article.replaceOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                }
            }
        );
    })

    .patch(function(req,res){
        Article.updateOne(
            {title:req.params.articleTitle},
            // The $set flag then indicates the values that you want to update next
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete(function(req,res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted article");
                } else {
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
