const apiKey = "d5ae409298f63302d31fd042dd99915a"; // Replace with your OpenWeatherMap API key

let isCelsius = true; // Default unit is Celsius

// Get weather for a given city
function getWeather() {
  const city = document.getElementById('city').value;
  if (!city) {
    document.getElementById('error-message').innerText = 'Please enter a city!';
    return;
  }

  fetchWeather(city);
}

// Get weather for user's geolocation
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

// Fetch weather data by city name
function fetchWeather(city) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "404" || !data.main) {
        document.getElementById('error-message').innerText = 'Weather data not available for your location. Please try another city.';
      } else {
        document.getElementById('error-message').innerText = '';
        updateWeatherUI(data);
        fetchForecast(city);
      }
    });
}

// Fetch weather data by coordinates
function fetchWeatherByCoords(lat, lon) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "404" || !data.main) {
        document.getElementById('error-message').innerText = 'Weather data not available for your location.';
      } else {
        document.getElementById('error-message').innerText = '';
        updateWeatherUI(data);
        fetchForecastByCoords(lat, lon);
      }
    });
}

// Update UI with the current weather data
function updateWeatherUI(data) {
  document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°${isCelsius ? 'C' : 'F'}`;
  document.getElementById('description').innerText = `Description: ${data.weather[0].description}`;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Toggle between Celsius and Fahrenheit
function toggleUnits() {
  isCelsius = !isCelsius;
  const city = document.getElementById('city').value;
  if (city) {
    fetchWeather(city);
  }
  document.querySelector('#unit-toggle button').innerText = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
}

// Fetch 5-day forecast
function fetchForecast(city) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      const forecastData = document.getElementById('forecast-data');
      forecastData.innerHTML = '';
      data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { // 3-hour interval data
          const dayForecast = document.createElement('div');
          dayForecast.innerHTML = `
            <h4>${forecast.dt_txt}</h4>
            <p>Temp: ${forecast.main.temp}°${isCelsius ? 'C' : 'F'}</p>
            <p>${forecast.weather[0].description}</p>
          `;
          forecastData.appendChild(dayForecast);
        }
      });
    });
}

// Fetch 5-day forecast by coordinates
function fetchForecastByCoords(lat, lon) {
  const unit = isCelsius ? 'metric' : 'imperial';
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      const forecastData = document.getElementById('forecast-data');
      forecastData.innerHTML = '';
      data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { // 3-hour interval data
          const dayForecast = document.createElement('div');
          dayForecast.innerHTML = `
            <h4>${forecast.dt_txt}</h4>
            <p>Temp: ${forecast.main.temp}°${isCelsius ? 'C' : 'F'}</p>
            <p>${forecast.weather[0].description}</p>
          `;
          forecastData.appendChild(dayForecast);
        }
      });
    });
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}