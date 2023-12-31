// Setup empty JS object to act as endpoint for all routes
let projectData = {};

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
app.use(express.static('dist'));

//Add a GET route
app.get('/data', (req, res) => {
    res.send(projectData);
});

//Add a POST route
app.post('/data', (req, res) => {
    projectData = req.body;
    res.send(projectData);
});

app.delete('/data', (req, res) => {
    projectData = {};
    res.sendStatus(200);
});

module.exports = app;