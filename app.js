const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather")
const API_KEY = "6320828b522ee3cedf3185121e3e1811";
const iconUrl = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png";
const citiesWeather = [];

const createWeatherCard = (cityName, weatherItem, index) => {
    const celsiusToFahrenheit = (celsius) => {
        return (celsius * 9/5) + 32;
    }
    if (index === 0) { //display as F and not C for the single day card 
        const tempCelsius = weatherItem.main.temp -273.15;
        const tempFahrenheit = celsiusToFahrenheit(tempCelsius);
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${tempFahrenheit.toFixed(2)}°F</h4>
                    <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4> 
                </div>
                <div class="icon">
                    <img src="${iconUrl}" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {  //5 day weather
        const tempCelsius = weatherItem.main.temp -273.15;
        const tempFahrenheit = celsiusToFahrenheit(tempCelsius);
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="${iconUrl}" alt="weather-icon">
                    <h4>Temp: ${tempFahrenheit.toFixed(2)}F°</h4>
                    <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity ${weatherItem.main.humidity}%</h4> 
                </li>`;
    }

}



//get weather forecast 
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    //get weather by 5 day forecast
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                    return true;
            }
            return false;
        });

        //clears out input value        
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        //something has to be wrong with my api key because the forecast keeps logging as an empty array
        //adding to DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }

        });

    }).catch(() => {
        alert("Failed to fetch the forecast.");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;


    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("Failed to fetch the coordinates.");
    })
    // get city details and post them

    const saveCitySearch = (city) => {
        citySearches.push(city);
        console.log (citySearches)
        localStorage.setItem('citySearches', JSON.stringify(citySearches));
    }
}

searchButton.addEventListener("click", getCityCoordinates);