const apiKey = "d5ae409298f63302d31fd042dd99915a";
let isCelsius = true;

function getWeather() {
  const city = document.getElementById('city').value;
  if (!city) {
    document.getElementById('error-message').innerText = 'Please enter a city!';
    return;
  }
  fetchWeather(city);
}

function useGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  } else {
    document.getElementById('error-message').innerText = 'Geolocation not supported!';
  }
}

function fetchWeather(city) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        document.getElementById('error-message').innerText = data.message || 'Weather data not available.';
      } else {
        document.getElementById('error-message').innerText = '';
        updateWeatherUI(data);
        fetchForecast(city);
      }
    });
}

function fetchWeatherByCoords(lat, lon) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        document.getElementById('error-message').innerText = data.message || 'Weather data not available.';
      } else {
        document.getElementById('error-message').innerText = '';
        updateWeatherUI(data);
        fetchForecastByCoords(lat, lon);
      }
    });
}

function updateWeatherUI(data) {
  document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°${isCelsius ? 'C' : 'F'}`;
  document.getElementById('description').innerText = `Description: ${data.weather[0].description}`;
  if (data.weather && data.weather[0]) {
    document.getElementById('weather-icon').src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  }
}

function toggleUnits() {
  isCelsius = !isCelsius;
  const city = document.getElementById('city').value;
  if (city) {
    fetchWeather(city);
  }
  document.querySelector('#unit-toggle button').innerText = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
}

function fetchForecast(city) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      const forecastData = document.getElementById('forecast-data');
      forecastData.innerHTML = '';
      if (data.list) {
        data.list.forEach((forecast, index) => {
          if (index % 8 === 0) {
            const dayForecast = document.createElement('div');
            dayForecast.innerHTML = `
              <h4>${forecast.dt_txt.split(" ")[0]}</h4>
              <p>Temp: ${forecast.main.temp}°${isCelsius ? 'C' : 'F'}</p>
              <p>${forecast.weather[0].description}</p>
            `;
            forecastData.appendChild(dayForecast);
          }
        });
      }
    });
}

function fetchForecastByCoords(lat, lon) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      const forecastData = document.getElementById('forecast-data');
      forecastData.innerHTML = '';
      if (data.list) {
        data.list.forEach((forecast, index) => {
          if (index % 8 === 0) {
            const dayForecast = document.createElement('div');
            dayForecast.innerHTML = `
              <h4>${forecast.dt_txt.split(" ")[0]}</h4>
              <p>Temp: ${forecast.main.temp}°${isCelsius ? 'C' : 'F'}</p>
              <p>${forecast.weather[0].description}</p>
            `;
            forecastData.appendChild(dayForecast);
          }
        });
      }
    });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// Load default weather
window.onload = () => {
  fetchWeather("Delhi");
};
