const geonamesUrl = 'http://api.geonames.org/searchJSON'
const geonamesUsername = process.env.GEONAMES_USERNAME
const weatherbitForecastUrl = 'http://api.weatherbit.io/v2.0/forecast/daily'
const weatherbitHistoricalUrl = 'http://api.weatherbit.io/v2.0/history/daily'
const weatherbitApiKey = process.env.WEATHERBIT_API_KEY
const pixabayUrl = 'https://pixabay.com/api/'
const pixabayApiKey = process.env.PIXABAY_API_KEY
const backendUrl = 'http://localhost:8000'

let trip = {};
const destination = document.getElementById('destination')
const travelDate = document.getElementById('travelDate')
const destinationResult = document.getElementById('destinationResult')
const dateResult = document.getElementById('dateResult')
const temperature = document.getElementById('temperature')
const weather = document.getElementById('weather')
const destPhoto = document.getElementById('destPhoto')
const currentTrip = document.getElementById('currentTrip')

//GET request to Geonames API
const fetchLocation = async (destination) => {
    const url = `${geonamesUrl}?q=${destination}&maxRows=1&username=${geonamesUsername}`
    try {
        const response = await fetch(url).then(value => value.json());
        const geonames = response["geonames"][0];
        return {lat: geonames["lat"], lon: geonames["lng"], country: geonames["countryName"]};
    } catch (error) {
        console.log('Geonames API Error:', error);
    }
}

//GET request to Weatherbit Forecast API
const fetchForecastWeather = async (location, date) => {
    const url = `${weatherbitForecastUrl}?lat=${location.lat}&lon=${location.lon}&key=${weatherbitApiKey}`
    const today = new Date();
    today.setHours(0, 0, 0, 0)
    const daysFromNow = Math.floor((date - today) / 3600 / 24 / 1000)
    try {
        const response = await fetch(url).then(value => value.json());
        const data = response["data"][daysFromNow];
        return {temp: data["temp"], description: data["weather"]["description"]};
    } catch (error) {
        console.log('Weatherbit Forecast API Error:', error);
    }
}

//GET request to Weatherbit Historical API
const fetchHistoricalWeather = async (location, date) => {
    let newDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const url = `${weatherbitHistoricalUrl}?lat=${location.lat}&lon=${location.lon}&start_date=${newDate}&end_date=${newDate}&key=${weatherbitApiKey}`
    try {
        const response = await fetch(url).then(value => value.json());
        const data = response["data"][0];
        return {temp: data["temp"], description: data["weather"]["description"]};
    } catch (error) {
        console.log('Weatherbit Historical API Error:', error);
    }
}

//GET request to Pixabay API
const fetchImage = async (location) => {
    const url = `${pixabayUrl}?q=${location.country}&image_type=photo&key=${pixabayApiKey}`
    try {
        const response = await fetch(url).then(value => value.json());
        return response["hits"][0]["webformatURL"];
    } catch (error) {
        console.log('Pixabay API Error:', error);
    }
}

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

// DELETE Request
async function deleteData(event) {
    const response = await fetch(`${backendUrl}/data`, {
        method: 'DELETE'
    });

    try {
        const res = await response;
        console.log("Delete data:" + res.ok);
        if (res.ok) {
            trip = {}
            currentTrip.style.visibility = "hidden";
        }
    } catch (error) {
        console.log("Error,", error);
    }
}

// Update UI
const updateUI = async (trip) => {
    destinationResult.innerHTML = `${trip.destination}, ${trip.location.country}`
    dateResult.innerHTML = trip.date
    temperature.innerHTML = trip.weatherData.temp
    weather.innerHTML = trip.weatherData.description
    destPhoto.src = trip.imageUrl
    currentTrip.style.visibility = "visible";
}

function handleSubmit(event) {
    event.preventDefault()

    trip.destination = destination.value
    trip.date = travelDate.value

    fetchLocation(trip.destination)
        .then(function (location) {
            trip.location = location

            const today = new Date();
            today.setHours(0, 0, 0, 0)
            const date = new Date(trip.date);
            if (date - today >= 0) {
                return fetchForecastWeather(location, date)
            } else {
                return fetchHistoricalWeather(location, date)
            }
        })
        .then(function (weatherData) {
            trip.weatherData = weatherData
            return fetchImage(trip.location)
        })
        .then(function (imageUrl) {
            trip.imageUrl = imageUrl
            console.log(trip)
            return postData(`${backendUrl}/data`, trip)
        })
        .then(function () {
            return updateUI(trip);
        })
}

export {handleSubmit, deleteData}