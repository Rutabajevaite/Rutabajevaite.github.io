"use strict";


let long;
let lat;
const api = {
    key: "2f83d3854da352b798c8c3b4aaae35b4",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const search = document.querySelector('.city_search');
search.addEventListener('keypress', setEnter);

const buttonSearch = document.querySelector('.searchButton');
buttonSearch.addEventListener('click', setButton);

const mainForcast = document.querySelector('.forecast_main');

window.addEventListener('load', () => {
    //call for location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            let coordsApi = `${api.baseurl}weather?lat=${lat}&lon=${long}&units=metric&appid=${api.key}`

            fetch(coordsApi)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    displayWeather(data)
                });
            })
        }
    });
        
function setEnter(event) {
    if (event.keyCode == 13) {
        getForecast(search.value);
        search.value = '';
        mainForcast.innerHTML = '';
    }
}

function setButton() {
    getForecast(search.value);
    search.value = '';
    mainForcast.innerHTML = '';
}

function displayWeather(data) {

    let city = document.querySelector('.location .city');
    city.innerText = `${data.name}, ${data.sys.country}`;

    let date = document.querySelector('.location .date');
    date.innerText = new Date(data.dt * 1000).toDateString();

    let temp = document.querySelector('.weather_now .temp');
    temp.innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;

    let weatherIcon = document.querySelector('.weather_now .weather_icon_today');
    weatherIcon.innerHTML = `assets/images/${data.weather[0].icon}.png`;

    let weatherDescription = document.querySelector('.weather_now .description');
    weatherDescription.innerText = `${data.weather[0].description}`;

    let hiLow = document.querySelector('.weather_now .high-low');
    hiLow.innerText = `Low: ${Math.round(data.main.temp_min)}°C /High: ${Math.round(data.main.temp_max)}°C`;

}

//call for 5 days forecast
function getForecast(query) {
    fetch(`${api.baseurl}forecast?q=${query}&units=metric&appid=${api.key}`)
        .then(forecastData => {
            return forecastData.json()
        }).then(displayForecast)
}

function displayForecast(forecastData) {

    let citySearchName = document.querySelector('.citySearchName');

    if (forecastData.cod == 404) {
        citySearchName.innerHTML = `No city found!`;
    } else if (forecastData.cod == 200) {
        citySearchName.innerHTML = `${forecastData.city.name}, ${forecastData.city.country}`;
    } else if (search.value == '') {
        citySearchName.innerHTML = `Please enter city name!`;
    }

    let forecast = [];
    for (let i = 0; i < forecastData.list.length; i += 8) {
        let array = [
            forecastData.list[i].weather[0].icon,
            forecastData.list[i].main.temp,
            forecastData.list[i].main.temp_min,
            forecastData.list[i].main.temp_max,
            forecastData.list[i].weather[0].description,
            forecastData.list[i].dt
        ];
        forecast.push(array);
    }

    for (let j = 0; j < forecast.length; j++) {
        mainForcast.innerHTML += '<section class="days"><div class="date">' + new Date(forecast[j][5] * 1000).toDateString() + '</div>' +
        '<div class="temp">' + Math.round(forecast[j][1]) + '<span>°C</span></div>' +
        '<img class="weather_icon_today" src="assets/images/' + forecast[j][0] + '.png" alt="weather"><div class="description">' + forecast[j][4] + '</div>' +
        '<div class="high-low"> Low: ' + Math.round(forecast[j][2]) + '°C/ High: ' + Math.round(forecast[j][3]) + ' °C</span></div></section>'
    };
}

function activatePlaces() {
    let input = document.getElementById('autocompleteInput');
    let autocomplete = new google.maps.places.Autocomplete(input);
}
