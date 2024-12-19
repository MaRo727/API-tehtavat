const apiKey = "b3f9ed68d2dde6f318f75c192d6993c3";
const pexelsApiKey = "CjMKbiOvetsF0Cec2NNKCaBAP5uljAZVOnwBF4Ynl9kghGNnWVrXlK4k";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const errorDiv = document.getElementById("error");
const weatherInfoDiv = document.getElementById("weatherInfo");
const aqiInfoDiv = document.getElementById("aqiInfo");
const mapContainer = document.getElementById("mapContainer");

let map;

searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchWeather(cityName);
    } else {
        displayError("Please enter a city name.");
    }
});

function fetchWeather(cityName) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    fetch(weatherUrl)
        .then(response => {
            console.log(response);
            if (!response.ok) throw new Error("City not found.");
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            fetchForecast(cityName);
            fetchAirQuality(data.coord.lat, data.coord.lon);
            updateBackground(data.weather[0].description);
            loadRainMap(data.coord.lat, data.coord.lon);
        })
        .catch(error => displayError(error.message));
}

function fetchForecast(cityName) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data));
}

function fetchAirQuality(lat, lon) {
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(aqiUrl)
        .then(response => response.json())
        .then(data => displayAirQuality(data));
}

function displayCurrentWeather(data) {
    weatherInfoDiv.innerHTML = `
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}
let forecastChart;

function displayForecast(data) {
    const labels = [];
    const temperatures = [];
    const rainfall = [];

    data.list.forEach((item, index) => {
        if (index % 8 === 0) {
            labels.push(item.dt_txt.split(" ")[0]);
            temperatures.push(item.main.temp);
            rainfall.push(item.rain ? item.rain["3h"] : 0);
        }
    });

    const ctx = document.getElementById("forecastChart").getContext("2d");

    if (forecastChart) {
        forecastChart.destroy();
    }

    forecastChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                { label: "Temperature (°C)", data: temperatures, borderColor: "orange", fill: false },
                { label: "Rainfall (mm)", data: rainfall, borderColor: "blue", fill: false }
            ]
        }
    });
}

function displayAirQuality(data) {
    const aqi = data.list[0].main.aqi;
    const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    aqiInfoDiv.textContent = `Air Quality Index: ${levels[aqi - 1]}`;
}

function updateBackground(description) {
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${description}&per_page=1`;
    fetch(pexelsUrl, { headers: { Authorization: pexelsApiKey } })
        .then(response => response.json())
        .then(data => {
            if (data.photos.length > 0) {
                document.body.style.backgroundImage = `url(${data.photos[0].src.large})`;
            }
        });
}

function loadRainMap(lat, lon) {
    if (!map) {
        map = L.map("mapContainer").setView([lat, lon], 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }

    L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`).addTo(map);
}

function displayError(message) {
    errorDiv.textContent = message;
    setTimeout(() => (errorDiv.textContent = ""), 3000);
}
document.getElementById('currentLocationButton').addEventListener('click', getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('locationOutput').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById('locationOutput').innerHTML = `Latitude: ${lat}, Longitude: ${lon}`;
    fetchWeatherByCoordinates(lat, lon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('locationOutput').innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('locationOutput').innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('locationOutput').innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('locationOutput').innerHTML = "An unknown error occurred.";
            break;
    }
}

function fetchWeatherByCoordinates(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            fetchAirQuality(data.coord.lat, data.coord.lon);
            updateBackground(data.weather[0].description);
            loadRainMap(data.coord.lat, data.coord.lon);
        })
        .catch(error => displayError(error.message));
}