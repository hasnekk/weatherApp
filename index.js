import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const myApiKey = 'ba5bb9f47d5308a2935533cdfcb7b775';
const API_URL_TODAY = `https://api.openweathermap.org/data/2.5/weather?appid=${myApiKey}&units=metric`;
const API_URL_FUTURE = `https://api.openweathermap.org/data/2.5/forecast?appid=${myApiKey}&units=metric`;

// modules
import data from "./model/data.js";

// static files // bodyparsers // viewengine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', 'views');


// functionality functions

//      fetch today weather
async function getTodaysWeather(city) {
    let url = API_URL_TODAY + `&q=${city}`;
    let response = await axios.get(url);
    return response.data;
}

//      fetch future weather
async function getFutureWeather(city){
    let url = API_URL_FUTURE + `&q=${city}`;
    let response = await axios.get(url);

    let futureWeathers = [];

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    let currentDate = `${year}-${month}-${day}`;
    response.data.list.forEach(dateTime => {
        if(currentDate != dateTime.dt_txt.split(' ')[0]){
            if(dateTime.dt_txt.split(' ')[1] === '15:00:00'){
                futureWeathers.push(dateTime);
            }
        }
    });

    return futureWeathers;
}

//      fetch backGroundImage
function getBg(weather) {

    let dataToReturn = {};

    switch (weather) {
        case 'Rain':
            dataToReturn = data.images.rain;
            break;
        case 'Snow':
            dataToReturn = data.images.snow;
            break;
        case 'Thunderstorm':
            datdataToReturna = data.images.storm;
            break;
        case 'Clear':
            dataToReturn = data.images.sun;
            break;
        default: dataToReturn = data.images.sun;
            break;
    }

    return dataToReturn;

}

// http requests
app.get('/', (req, res) => {
    res.redirect('/weather');
});

app.get('/weather', async (req, res) => {
    let currentCity = 'Mostar';

    let todaysWeather = await getTodaysWeather(currentCity);
    todaysWeather.time = new Date().toUTCString().slice(5, 16);

    let backGrounds = getBg(todaysWeather.weather[0].main);

    let futureWeather = await getFutureWeather(currentCity); // array

    let allData = {
        todaysWeather: todaysWeather,
        backGrounds: backGrounds,
        futureWeather: futureWeather // array
    }

    res.render('index.ejs', allData);

});


app.post('/weather', async (req, res) => {

    let currentCity = req.body.search;
    let allData = {};

    try {
        let todaysWeather = await getTodaysWeather(currentCity);
        todaysWeather.time = new Date().toUTCString().slice(5, 16);

        let backGrounds = getBg(todaysWeather.weather[0].main);

        let futureWeather = await getFutureWeather(currentCity); // array

        allData.todaysWeather = todaysWeather;
        allData.backGrounds = backGrounds;
        allData.futureWeather = futureWeather // array

        res.render('index.ejs', allData);
    } catch (err) {
        res.send('Error: ' + err.message + ' ' + currentCity + ' not found.');
    }

});

// server running
app.listen(port, (err) => {
    if (err) {
        console.info(err.message);
    } else {
        console.info('Server listening on port: ' + port);
    }
});