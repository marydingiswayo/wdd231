// Company Spotlight
document.addEventListener('DOMContentLoaded', function() {
    const spotlightContainer = document.getElementById('spotlight-container');
    
    if (!spotlightContainer) return;
    
    // Sample JSON data (in real project, fetch from external file)
    const companies = [
        {
            "name": "Tesoro Hotel",
            "address": "123 Main Street, San Miguel",
            "phone": "(503) 1234-5678",
            "website": "https://hoteltesoro.com",
            "image": "images/tesoro-hotel.jpg",
            "membership": "gold",
            "description": "Luxury accommodations and event venue"
        },
        {
            "name": "El Roble Restaurant",
            "address": "456 Commerce Ave, San Miguel",
            "phone": "(503) 9876-5432",
            "website": "https://elroble.com",
            "image": "images/el-roble.jpg",
            "membership": "silver",
            "description": "Traditional Salvadoran cuisine"
        },
        {
            "name": "San Miguel Textiles",
            "address": "789 Industrial Blvd, San Miguel",
            "phone": "(503) 4567-8901",
            "website": "https://sanmigueltextiles.com",
            "image": "images/san-miguel-textiles.jpg",
            "membership": "gold",
            "description": "Textile manufacturing and exports"
        },
        {
            "name": "Café Aroma",
            "address": "321 Market Street, San Miguel",
            "phone": "(503) 2345-6789",
            "website": "https://cafearoma.com",
            "image": "images/cafe-aroma.jpg",
            "membership": "silver",
            "description": "Premium coffee roastery"
        }
    ];
    
    // Filter gold and silver members
    const eligibleCompanies = companies.filter(company => 
        company.membership === 'gold' || company.membership === 'silver'
    );
    
    // Randomly select 2-3 companies
    const numToShow = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const shuffled = [...eligibleCompanies].sort(() => 0.5 - Math.random());
    const selectedCompanies = shuffled.slice(0, numToShow);
    
    // Display selected companies
    spotlightContainer.innerHTML = selectedCompanies.map(company => `
        <article class="company-card ${company.membership}">
            <h3>${company.name}</h3>
            <p>${company.description}</p>
            <p><strong>Address:</strong> ${company.address}</p>
            <p><strong>Phone:</strong> ${company.phone}</p>
            <p><a href="${company.website}" target="_blank">Visit Website</a></p>
            <p class="membership-badge">${company.membership.toUpperCase()} Member</p>
        </article>
    `).join('');
});
// Weather API Integration
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const lat = '13.4833';
    const lon = '-88.1833';
    const units = 'imperial';
    
    const currentTemp = document.getElementById('current-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const forecastContainer = document.getElementById('forecast-container');
    
    if (!currentTemp) return;
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            // Current weather
            const current = data.list[0];
            currentTemp.innerHTML = `${Math.round(current.main.temp)}°F`;
            weatherDesc.textContent = current.weather[0].description;
            
            // 3-day forecast
            const forecast = [];
            for (let i = 0; i < data.list.length; i++) {
                const item = data.list[i];
                const date = new Date(item.dt_txt);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                // Get one forecast per day (around noon)
                if (date.getHours() === 12) {
                    forecast.push({
                        day: day,
                        temp: Math.round(item.main.temp),
                        icon: item.weather[0].icon,
                        desc: item.weather[0].description
                    });
                    
                    if (forecast.length === 3) break;
                }
            }
            
            // Display forecast
            forecastContainer.innerHTML = forecast.map(item => `
                <div class="forecast-day">
                    <h4>${item.day}</h4>
                    <img src="https://openweathermap.org/img/wn/${item.icon}.png" alt="${item.desc}" width="50" height="50">
                    <p>${item.temp}°F</p>
                    <p class="small">${item.desc}</p>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            currentTemp.textContent = 'Weather data unavailable';
            forecastContainer.innerHTML = '<p>Forecast unavailable</p>';
        });
});