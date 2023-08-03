import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

// static files // bodyparsers // viewengine
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', 'views');

// http requests
app.get('/', (req, res) => {
    res.redirect('/weather');
});

app.get('/weather', (req, res) => {
    res.render('index.ejs');
});



// server running
app.listen(port, (err) => {
    if(err){
        console.info(err.message);
    }else{
        console.info('Server listening on port: ' + port);
    }
});