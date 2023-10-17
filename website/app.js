/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = 'b965444885756d1809d1b81b733240de&units=imperial'

const generate = document.getElementById("generate");
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");
const temp = document.getElementById("temp");
const date = document.getElementById('date')
const content = document.getElementById('content')

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

//GET request to the OpenWeatherMap API
const fetchWeather = async (baseURL, zipCode, apiKey) => {
    const url = `${baseURL}?zip=${zipCode}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log('Error:', error);
    }
}

// Event listener
generate.addEventListener('click', () => {
    fetchWeather(baseURL, zip.value, apiKey)
        .then(function (data) {
            console.log(data);
            return postData('/data', {date: newDate, temp: data.main.temp, content: feelings.value});
        })
        .then(function (data) {
            return updateUI();
        })
})

// POST Request
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("Error,", error);
    }
}

// Update UI
const updateUI = async () => {
    const request = await fetch('/data');
    try {
        const allData = await request.json();
        console.log(allData);
        temp.innerHTML = 'Temperature: ' + allData.temp + ' degrees';
        content.innerHTML = 'Feelings: ' + allData.content;
        date.innerHTML = 'Date: ' + allData.date;
    } catch (error) {
        console.log("Error", error);
    }
}
