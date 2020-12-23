const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();
 
const app = express();
// Allows to serve static files if put in a folder called public (e.g. css and images)
// All files in there need to be directed to relative to the public folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});
 
app.post("/", function(req, res){
 
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
 
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
 
//   Set up the location for the API and turn the posted data in the form to a JSON
  const jsonData = JSON.stringify(data);
  const url = "https://us2.api.mailchimp.com/3.0/lists/cd3d534d16";
  const apiKey = process.env.APIKEY;
  const option = {
    method: "POST",
    auth: "robdeboer:" + apiKey
  }
 
//  Setting up where to send the requests to 
  const request = https.request(url, option, function(response){
 
    // If the response is successful, send the success.html file
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
    // If the response isn't successful, send the failure.html file 
      }   else {
            res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    //   const responseData = (JSON.parse(data));
    //   const userID = (responseData.new_members[0].id);
    //   console.log("`Successfully added contact as an audience member. The contact's id is " + userID);
    
    })
  })
 
//   Passing the JSON data to the mailchimp server
  request.write(jsonData);
  request.end();
 
});

// Redirects the user to the home route when something is posted to the failure page (e.g. via the button)
app.post("/failure", function(req, res) {
    res.redirect("/")
});

// If the code is uploaded onto a server (e.g. Heroku), the port needs to be specified to a dynamic port that Heroku specifies
// The || is an or to allow it to listen for a local port too
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
// API Key
// 8076aa4c98414167727ffefe1c950bca-us2

// Audience ID
// cd3d534d16

