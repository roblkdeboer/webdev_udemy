//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setting up the passport session
app.use(session({
    secret:"Our little secret.",
    resave: false,
    saveUninitialized: false,
}));

// Initialise and use passport session
app.use(passport.initialize());
app.use(passport.session());




// Create the mongoose DB connection on local hose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);


// Set up new mongoose schema in the DB
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Adding the passport as a plugin to hash and salt the passwords
userSchema.plugin(passportLocalMongoose);

// Set up a new user model
// Name of the collection = User is created using the userSchema
const User = new mongoose.model("User", userSchema)

// Configure the local passport to create a local strategy and to serialise and deserialise the code
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

    // New user created from mongoose model taking the data keyed into the login form
    const user = new User({
        username: req.body.username,
        passport: req.body.password
    });

    // if the login creds are valid, send a cookie to the browser validating the login and allowing to view secret content
    req.login(user, function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});

// Render register page
app.get("/register", function(req,res){
    res.render("register");
});

// Render secrets page to allow users to access it if they're still logged in.  If not, they get redirected to the login page
app.get("/secrets", function(req,res){
    
    if (req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
})

// Take the post request from the form on the register page
// Body parser takes the input from name=userName and name=password
// Use bcrypt to hash and salt the password
app.post("/register", function (req, res) {

    // Set up registering a user with mongoose
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            // If the authentication is successful then trigger the callback
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});

// Render home page after clicking on logout and deauthenticate the user and end the user session
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});


app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
