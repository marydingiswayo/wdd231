document.addEventListener('DOMContentLoaded', function() {
    // 1. GET YOUR REAL API KEY from https://openweathermap.org/api
    const apiKey = 'YOUR_REAL_API_KEY_HERE'; // ← REPLACE THIS!
    
    // 2. Set your location (or get from browser geolocation)
    const lat = '13.4833';  // Change if needed
    const lon = '-88.1833'; // Change if needed
    const units = 'imperial';
    
    const currentTemp = document.getElementById('current-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const forecastContainer = document.getElementById('forecast-container');
    
    // Better error handling
    if (!currentTemp || !forecastContainer) {
        console.error('Required elements not found');
        return;
    }
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    
    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // CURRENT WEATHER
            const current = data.list[0];
            currentTemp.innerHTML = `${Math.round(current.main.temp)}°F`;
            weatherDesc.textContent = current.weather[0].description.charAt(0).toUpperCase() + 
                                      current.weather[0].description.slice(1);
            
            // 3-DAY FORECAST (FIXED)
            const forecast = [];
            const today = new Date();
            const processedDays = new Set();
            
            for (let i = 0; i < data.list.length; i++) {
                const item = data.list[i];
                const date = new Date(item.dt_txt);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                // Skip today's forecasts
                if (date.getDate() === today.getDate()) continue;
                
                // Get one forecast per day (closest to 12:00)
                const hour = date.getHours();
                if ((hour >= 9 && hour <= 15) && !processedDays.has(dayName)) {
                    forecast.push({
                        day: dayName,
                        temp: Math.round(item.main.temp),
                        icon: item.weather[0].icon,
                        desc: item.weather[0].description
                    });
                    processedDays.add(dayName);
                    
                    if (forecast.length === 3) break;
                }
            }
            
            // DISPLAY FORECAST
            if (forecast.length > 0) {
                forecastContainer.innerHTML = forecast.map(item => `
                    <div class="forecast-day">
                        <h4>${item.day}</h4>
                        <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" 
                             alt="${item.desc}" width="60" height="60">
                        <p>${item.temp}°F</p>
                        <p class="small">${item.desc}</p>
                    </div>
                `).join('');
            } else {
                forecastContainer.innerHTML = '<p>Forecast data unavailable</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            currentTemp.textContent = 'Weather data unavailable';
            weatherDesc.textContent = 'Please check API key and connection';
            forecastContainer.innerHTML = '<p>Forecast unavailable</p>';
        });
});
const apiKey = 'abc123yourrealapikeyhere'; // Your real key

const lat = '40.7128';  // Example: New York
const lon = '-74.0060';