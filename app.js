const searchBtn = document.querySelector('#search')
const APIkey = '6320828b522ee3cedf3185121e3e1811'
const cityInput = document.querySelector('#city-input')

function kToF(kelvin) {
    return (kelvin * 9/5) - 459.67;
}

function createDayEl(weatherObj){
    const div = document.createElement('div')
    const date = document.createElement('p')
    date.textContent = dayjs.unix(weatherObj.dt).format('M/D/YYYY')
    div.appendChild(date)
    const temp = document.createElement('p')
    temp.textContent = `${kToF(weatherObj.main.temp).toFixed(1)} °F`
    div.appendChild(temp)
    const humidity = document.createElement('p')
    humidity.textContent = `Humidity: ${weatherObj.main.humidity}`
    div.appendChild(humidity)
    const wind = document.createElement('p')
    wind.textContent = `Wind: ${weatherObj.wind.speed}`
    div.appendChild(wind)

    return div
}

searchBtn.addEventListener('click', async()=> {
    const inputCity = document.querySelector('#city-input').value

    const cityResult = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputCity}&limit=1&appid=${APIkey}`)


    const {lat, lon} = (await cityResult.json())[0];

    console.log({lat, lon})

    const forecastResult = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`)

   
    const weatherArr = (await forecastResult.json()).list.filter((el, i) => i % 8 === 0)

    console.log(weatherArr)

   const todayDiv = document.querySelector('#today')
   const h2 = document.createElement('h2')
   h2.textContent = inputCity
   todayDiv.appendChild(h2)
   todayDiv.appendChild(createDayEl(weatherArr[0]))


   const fiveDay = document.querySelector('#five-day')
   weatherArr.forEach(el => fiveDay.appendChild(createDayEl(el)))

    //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
})

function saveCityToLocalStorage(city) {
    localStorage.setItem('lastCity', city);
}

function loadCityFromLocalStorage() {
    return localStorage.getItem('lastCity');
}

searchBtn.addEventListener('click', async () => {
    const inputCity = cityInput.value;

    saveCityToLocalStorage(inputCity);
})

window.addEventListener('load', () => {
    const lastCity = loadCityFromLocalStorage();
    if (lastCity) {
        cityInput.value = lastCity;
    }
    if (lastCity) {
        searchBtn.click();
    }
})

