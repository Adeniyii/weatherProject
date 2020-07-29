// jshint esversion:6

require("dotenv").config();
const myExpress = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = myExpress();
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req, res){

  const apiKey = process.env.apiKey;
  const city = req.body.city;
  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response){
    console.log("status code:", response.statusCode);
    console.log("Status message:", response.statusMessage);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const coordinates = weatherData.coord;
      const weatherDesc = weatherData.weather[0].description;
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<h1>The weather temperature in " + city + " is " + temp + " degrees celcius.</h1>");
      res.write("<h1>The weather description is: " + weatherDesc + "</h1>");
      res.write("<img src=" +iconURL+ ">");
      res.send();
    });
  });
});




app.listen(3000, function(){
  console.log("Listening on port 3000.");
});
