// Setup empty JS object to act as endpoint for all routes
let projectData = {};

const port = 8000;
// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

//Add a GET route
app.get('/data', (req, res) => {
    res.send(projectData);
});

//Add a POST route
app.post('/data', (req, res) => {
    projectData = {
        temp: req.body.temp,
        date: req.body.date,
        content: req.body.content
    };
    res.send(projectData);
});

// Setup Server
app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});