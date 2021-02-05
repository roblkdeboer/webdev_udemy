//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const findOrCreate = require("mongoose-findorcreate");

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
    password: String,
    googleId: String,
    secret: String
});

// Adding the passport as a plugin to hash and salt the passwords
userSchema.plugin(passportLocalMongoose);

// Adding the findorcreate plugin
userSchema.plugin(findOrCreate);

// Set up a new user model
// Name of the collection = User is created using the userSchema
const User = new mongoose.model("User", userSchema)

// Configure the local passport to create a local strategy and to serialise and deserialise the code
passport.use(User.createStrategy());

// Allows serialisation and deserialisation of users for all kinds of authentication
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
    //   Tap into the user model to find a user to either create them or find the ID to authenticate locally
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

// Render home page
app.get("/", function(req,res){
    res.render("home");
});

// Render the google auth page to authenticate users via google strategy
app.get("/auth/google", passport.authenticate("google", {
    scope: ["email","profile"]
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get("/auth/google/secrets", 
// Authenticate locally and direct them to secrets
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    //   Redirect when login/auth is successful
    res.redirect("/secrets");
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

// // Render secrets page to allow users to access it if they're still logged in.  If not, they get redirected to the login page
// app.get("/secrets", function(req,res){
    
//     if (req.isAuthenticated()){
//         res.render("secrets");
//     } else {
//         res.redirect("/login");
//     }
// })

// Render the secrets page showing other people's secrets
app.get("/secrets", function (req, res) {
    // Search the DB for people with secrets on their records
    User.find({ "secret": { $ne: null } }, function (err, foundUsers) {
        if (err) {
            console.log(err);
        } else {
            if (foundUsers) {
                // Render the secrets page with a user's secret, send to the secrets.ejs
                res.render("secrets", { usersWithSecrets: foundUsers });
            }
        }
    });
});

// Render the submit page if the user is authenticated
app.get("/submit", function(req,res){
    if (req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
})

// When a secret is submitted to the post page
app.post("/submit", function(req,res){
    const submittedSecret = req.body.secret;

    // Find the userId and save the submitted secret in the DB
    User.findById(req.user.id, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                    res.redirect("/secrets");
                });
            }
        }
    });
});


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
