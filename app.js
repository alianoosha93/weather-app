
const apiKey = "cdb22b689f4e415d99d2c2a03d95009b";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const input = document.getElementById('input');
const searchButton = document.getElementById('search');
const city = document.getElementById('city');
const image = document.getElementById('img');
const temperature = document.getElementById('temperature');
const clouds = document.getElementById('clouds');

searchButton.addEventListener('click', () => {
    const cityName = input.value;

    fetch(`${apiUrl}${cityName}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        city.textContent = `${data.name}, ${data.sys.country}`;
        image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        clouds.textContent = data.weather[0].description;

        // Get the forecast based on the city's coordinates
        getForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => console.error('Error fetching data:', error));
});

function getForecast(latitude, longitude) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
        displayHourlyForecast(data);
        displayDailyForecast(data);
    })
    .catch(error => console.error('Error fetching forecast data:', error));
}

function displayHourlyForecast(forecast) {
    const templist = document.querySelector('.templist');
    templist.innerHTML = '';

    for (let i = 0; i < forecast.list.length; i += 3) {
        const date = new Date(forecast.list[i].dt * 1000);
        
        const time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerHTML = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' }).replace(':00', '');

        const temp = document.createElement('p');
        temp.innerHTML = `${Math.round(forecast.list[i].main.temp_max)}°C / ${Math.round(forecast.list[i].main.temp_min)}°C`;

        const desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerHTML = forecast.list[i].weather[0].description;

        const div = document.createElement('div');
        div.appendChild(time);
        div.appendChild(temp);
        templist.appendChild(div);
        templist.appendChild(desc);
    }
}

function displayDailyForecast(forecast) {
    const weekF = document.querySelector('.weekF');
    weekF.innerHTML = '';

    for (let i = 0; i < forecast.list.length; i += 8) {
        const div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        const day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, {timeZone: 'Asia/Karachi'});
        div.appendChild(day);

        const temp = document.createElement('p');
        temp.innerText = `${Math.round(forecast.list[i].main.temp_max)}°C / ${Math.round(forecast.list[i].main.temp_min)}°C`;
        div.appendChild(temp);

        const description = document.createElement('p');
        description.setAttribute('class', 'description');
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        weekF.appendChild(div);
    }
}