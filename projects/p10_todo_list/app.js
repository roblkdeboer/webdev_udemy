
// Requiring two packages installed
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

// Creating an array of empty letiables to be handled in the post request
// Can add items into the array to make them load up when the page is loaded
const items = ["Cook Food", "Eat Food"];
const workItems = [];

// Telling the app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Tells express to serve up these files
app.use(express.static("public"));

// Use ejs as the view engine
app.set("view engine", "ejs");

// What happens when someone tries to access my home page
app.get("/", function (req, res) {

  // Takes the data sent from the date.js module created for the getDate function
  const day= date.getDate();

  // Do all the logic and send the data/files at the end
  // Pass in the day and the new items taken in from the form
  res.render("list", { listTitle: day, newListItems: items});
});

// Handle post requests that go to a specific route (home route)
// newItem is received from the form and body searches for an item called newItem
// newItem is appended to the empty array above
// redirects to the home route
// Moves up to the app.get for the home route passing in the new item
// If list item came from the work list, it gets posted to the work page to create a list item there
app.post("/", function (req, res) {
  const item = req.body.newItem;

  if(req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else{
    items.push(item);
    res.redirect("/");
  }
});

// What happens when someone tries to access my work page page
app.get("/work", function (req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.get("/about", function(req,res){
  res.render("about");
})

// Listen on port 3000 and console log that server has been started
app.listen(3000, function () {
  console.log("Server started on port 3000.");
});

