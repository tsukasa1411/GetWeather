// https://api.openweathermap.org/data/2.5/weather?q=pune&appid=492f2388b7cae1c3e0dcf0f9c9056122

// 492f2388b7cae1c3e0dcf0f9c9056122
const express=require("express");
const app=express();
const path=require("path");
const fs=require("fs");
const EventEmitter=require("events");
const axios = require("axios");
const req = require("express/lib/request");
//here we are creating a class with the help of events
const eventEmitter=new EventEmitter();

//to set the view engine
app.set("view engine","hbs");

app.get("/",(req,res)=>{
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+(req.query.city||'delhi')+'&appid=492f2388b7cae1c3e0dcf0f9c9056122'

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: apiUrl,
    headers: { }
    };

    axios.request(config)
    .then((response) => {
        const date = new Date();

    // Get the options for the Indian time zone
    const options = {
      timeZone: 'Asia/Kolkata', // 'Asia/Kolkata' represents the Indian time zone
      hour12: true, // Set to false if you want 24-hour format
      weekday: 'long', // Display full weekday name
      year: 'numeric', // Display full year
      month: 'long', // Display full month name
      day: 'numeric', // Display day of the month
      hour: 'numeric', // Display hour (12-hour format)
      minute: 'numeric', // Display minute
      second: 'numeric', // Display second
    };

    // Convert the date to the Indian time zone
    const indianDateTime = date.toLocaleString('en-IN', options);
        //lets decide the weather icon on the 
        //app based on the condition and time
        let icon="fa-solid fa-sun fa-beat";
        let iconstyle="color: #eeeb44;";

        if(indianDateTime.hour>19||indianDateTime.hour<5){
            icon="fa-solid fa-moon" ;
            iconstyle="color: #989aa0;";
        }
        if(response.data.weather[0].description=="overcast clouds"){
            icon="fa-solid fa-cloud fa-beat";
            iconstyle="color: #b8c5db;";
        }
        res.render('frontend',{
            city:response.data.name,
            currtemp:Math.round(response.data.main.temp-273),
            mintemp:Math.round(response.data.main.temp_min-273-3),
            maxtemp:Math.round(response.data.main.temp_max-273+4),
            weathercondes:icon,
            weatherconstyle:iconstyle,
        });
    })
    .catch((error) => {
        console.log(error);
    });
});

app.get('*',(req,res)=>{
    //we will send the error page in all 
    //other cases
    res.status(404).render('ErrorPage');
});

app.listen(3000,()=>{console.log("listening");});
