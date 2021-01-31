//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongodbpw = process.env.MONGOPW;
mongoose.connect("mongodb+srv://admin-rob:" + mongodbpw + "@udemy-todolist.qmvor.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to you to-do list!"
})

const item2 = new Item({
  name: "Hit the + button to add a new item"
})

const item3 = new Item({
  name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];

// For every new list that is created, the name is stored and the array of item documents to be stored in the list
const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

  Item.find({}, function (err, foundItems) {

    // If there are no items in the collection, load the default items and redirect back to the root route and falls into the else block to load the saved items in the DB
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});


app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
 
 List.findOne({name: customListName}, function(err, foundList){
   if(!err){
     if (!foundList){
      //  Create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
     } else {
      //  Show an existing list
      res.render("list.ejs", { listTitle: foundList.name, newListItems: foundList.items });
     }
   }
 });
});


app.post("/", function (req, res) {

  // Taps into newItem which is from the input on the form on the home route
  // Add the entry to a DB item which can be saved into the DB then redirect to the home route
  const itemName = req.body.newItem;
  // When an entry is submitted, the name of the list is recorded
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });
  
  // If the listName is the default list (today) then save it and redirect to the home route
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      // Take the item posted and add it to the list array and save it and redirect to the listname route
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Item successfully deleted from DB");
        res.redirect("/");
      } else {
        console.log(err);
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, {$pull: {items: {_id: checkedItemId } } }, function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
