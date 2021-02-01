//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require('dotenv').config();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create the mongoose DB connection on local hose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Set up new mongoose schema in the DB
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Set up a new user model
// Name of the collection = User is created using the userSchema
const User = new mongoose.model("User", userSchema)

// Render home page
app.get("/", function(req,res){
    res.render("home");
});

// Render login page
app.get("/login", function(req,res){
    res.render("login");
});

// Take the post request from the form on the login page
// If the email field matches with the username field
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Find a user based on email, if the email exists, compare the hashed password entered, if it matches, render the secrets page
    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
});

// Render register page
app.get("/register", function(req,res){
    res.render("register");
});

// Take the post request from the form on the register page
// Body parser takes the input from name=userName and name=password
// Use bcrypt to hash and salt the password
app.post("/register", function(req,res){
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash            
        });
    
        // Save the newUser and if there's no error, render the secrets page
        newUser.save(function(err){
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});


app.listen(3000, function(){
    console.log("Server started on port 3000.");
});