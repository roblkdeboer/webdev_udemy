const express= require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config();

app.use(bodyParser.urlencoded({extended : true}));


// What happens when someone tries to access my home page
app.get("/", function(req,res){
    // Calls the index.html page
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
    // req.body.cityName parses the input to get the cityName input from the index.html file
    const query = req.body.cityName;
    const unit = "metric";
    const apiKey = process.env.APIKEY;
    // Send a GET request to the API
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey+ "&units=" + unit;
    // Callback function to get a response
    https.get(url, function(response){
        console.log(response.statusCode);

        // Call the response when we receive some data
        response.on("data", function(data) {
            // JSON.parse parses the response from the API
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            // Weather item is an array with one item
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon
            const imageURL= "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees celsius</h1>");
            res.write("<p>The weather is currently " + description + "</p>");
            res.write("<img src=" + imageURL + ">")
            res.send();
        })
    })
})



app.listen(3000, function(){
    console.log("Server is running on port 3000");
})