// Weather API Functions
const API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

let isCelsius = true;

// Get coordinates from city name
async function getCoordinates(city) {
  try {
    const response = await fetch(`${API_BASE}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      alert('City not found!');
      return null;
    }
    
    const result = data.results[0];
    return {
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude
    };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    alert('Error fetching city data');
    return null;
  }
}

// Get weather data
async function getWeatherData(latitude, longitude) {
  try {
    const response = await fetch(
      `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    alert('Error fetching weather data');
    return null;
  }
}

// Get weather icon based on code
function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code === 51 || code === 53 || code === 55) return '🌧️';
  if (code === 61 || code === 63 || code === 65) return '🌧️';
  if (code === 71 || code === 73 || code === 75) return '❄️';
  if (code === 80 || code === 81 || code === 82) return '⛈️';
  if (code === 85 || code === 86) return '❄️';
  if (code === 95 || code === 96 || code === 99) return '⛈️';
  return '🌤️';
}

// Get weather description
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with hail'
  };
  return descriptions[code] || 'Unknown';
}

// Convert temperature
function convertTemp(celsius) {
  return isCelsius ? celsius : Math.round((celsius * 9/5) + 32);
}

// Display current weather
function displayCurrentWeather(coords, weatherData) {
  const current = weatherData.current;
  const temp = convertTemp(current.temperature_2m);
  const unit = isCelsius ? '°C' : '°F';
  const icon = getWeatherIcon(current.weather_code);
  const description = getWeatherDescription(current.weather_code);
  
  const currentWeather = document.getElementById('current-weather');
  currentWeather.innerHTML = `
    <div class="location">
      <h2>${coords.name}, ${coords.country}</h2>
      <p id="current-time"></p>
    </div>
    <div class="weather-main">
      <div class="weather-icon">${icon}</div>
      <div class="temperature">${temp}${unit}</div>
    </div>
    <div class="weather-details">
      <div class="detail">
        <span class="label">Condition:</span>
        <span class="value">${description}</span>
      </div>
      <div class="detail">
        <span class="label">Humidity:</span>
        <span class="value">${current.relative_humidity_2m}%</span>
      </div>
      <div class="detail">
        <span class="label">Wind Speed:</span>
        <span class="value">${Math.round(current.wind_speed_10m)} km/h</span>
      </div>
    </div>
  `;
  
  updateTime();
  setInterval(updateTime, 1000);
}

// Update current time
function updateTime() {
  const now = new Date();
  document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

// Display forecast
function displayForecast(weatherData) {
  const forecast = weatherData.daily;
  const forecastDiv = document.getElementById('forecast');
  
  forecastDiv.innerHTML = '';
  
  for (let i = 0; i < Math.min(7, forecast.time.length); i++) {
    const date = new Date(forecast.time[i]);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const maxTemp = convertTemp(forecast.temperature_2m_max[i]);
    const minTemp = convertTemp(forecast.temperature_2m_min[i]);
    const icon = getWeatherIcon(forecast.weather_code[i]);
    const unit = isCelsius ? '°C' : '°F';
    
    const dayCard = document.createElement('div');
    dayCard.className = 'forecast-card';
    dayCard.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="forecast-icon">${icon}</div>
      <div class="temp-range">${maxTemp}${unit} / ${minTemp}${unit}</div>
      <div class="precipitation">${Math.round(forecast.precipitation_sum[i])} mm</div>
    `;
    
    forecastDiv.appendChild(dayCard);
  }
}

// Search weather
async function searchWeather() {
  const input = document.getElementById('city-input');
  const city = input.value.trim();
  
  if (!city) {
    alert('Please enter a city name');
    return;
  }
  
  const coords = await getCoordinates(city);
  if (!coords) return;
  
  const weatherData = await getWeatherData(coords.latitude, coords.longitude);
  if (!weatherData) return;
  
  displayCurrentWeather(coords, weatherData);
  displayForecast(weatherData);
  
  input.value = '';
}

// Get user location weather
async function getLocationWeather() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }
  
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const weatherData = await getWeatherData(latitude, longitude);
    
    if (!weatherData) return;
    
    // Reverse geocoding to get city name (using approximate method)
    const coords = {
      name: 'Your Location',
      country: '',
      latitude,
      longitude
    };
    
    displayCurrentWeather(coords, weatherData);
    displayForecast(weatherData);
  }, () => {
    alert('Unable to get your location');
  });
}

// Setup event listeners
document.getElementById('search-btn').addEventListener('click', searchWeather);
document.getElementById('city-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchWeather();
});

document.getElementById('location-btn').addEventListener('click', getLocationWeather);

document.getElementById('unit-toggle').addEventListener('change', (e) => {
  isCelsius = e.target.checked;
  const currentWeather = document.getElementById('current-weather');
  if (currentWeather.innerHTML) {
    // Re-display with new units
    searchWeather();
  }
});

// Load default city on page load
window.addEventListener('load', () => {
  document.getElementById('city-input').value = 'London';
  searchWeather();
});