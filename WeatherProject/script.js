class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeather(city) {
        if (!city) return null;
        const response = await fetch(`${this.baseUrl}?q=${city}&units=metric&appid=${this.apiKey}`);
        const data = await response.json();
        return data;
    }
}

class WeatherApp {
    constructor() {
        this.container = document.querySelector('.container');
        this.searchButton = document.querySelector('.searchBox button');
        this.weatherBox = document.querySelector('.weatherBox');
        this.weatherDetails = document.querySelector('.weatherDetails');
        this.error404 = document.querySelector('.notFound');
        this.alert = document.querySelector('.Alert');
        this.toggleBtn = document.querySelector('.unitToggle');
        this.temperatureElem = document.querySelector('.weatherBox .temperature');
        this.tempC = 0;
        this.isCelsius = true;

        this.weatherService = new WeatherService('5737003f67df08ca4695da8261427176');

        this.init();
    }

    init() {
        this.searchButton.addEventListener('click', () => this.handleSearch());
        this.toggleBtn.addEventListener('click', () => this.toggleTemperatureUnit());
    }

    async handleSearch() {
        const city = document.getElementById('searchBttn').value;
        const data = await this.weatherService.getWeather(city);
        if (!data) return;
        this.updateUI(data);
    }

    toggleTemperatureUnit() {
        if (this.isCelsius) {
            const fahrenheit = parseFloat((this.tempC * 9 / 5) + 32).toFixed(1);
            this.temperatureElem.innerHTML = `${fahrenheit}<span>°F</span>`;
            this.toggleBtn.textContent = 'Convert to °C';
        } else {
            this.temperatureElem.innerHTML = `${this.tempC}<span>°C</span>`;
            this.toggleBtn.textContent = 'Convert to °F';
        }
        this.isCelsius = !this.isCelsius;
    }

    updateUI(json) {
        if (json.cod === '404') {
            this.container.style.height = '450px';
            this.weatherBox.classList.remove('active');
            this.weatherDetails.classList.remove('active');
            this.error404.classList.add('active');
            return;
        }

        this.container.style.height = '560px';
        this.weatherBox.classList.add('active');
        this.weatherDetails.classList.add('active');
        this.error404.classList.remove('active');

        const image = document.querySelector('.weatherBox img');
        const description = document.querySelector('.weatherBox .description');
        const humidity = document.querySelector('.weatherDetails .humidity span');
        const wind = document.querySelector('.weatherDetails .wind span');

        const weatherType = json.weather[0].main;

        switch (weatherType) {
            case 'Clear':
                image.src = 'ProjImages/sun.png';
                break;
            case 'Rain':
                image.src = 'ProjImages/rainy-day.png';
                break;
            case 'Snow':
                image.src = 'ProjImages/temperature.png';
                break;
            case 'Clouds':
                image.src = 'ProjImages/cloudy.png';
                break;
            case 'Mist':
                image.src = 'ProjImages/cloud-and-wind.png';
                break;
            case 'Haze':
                image.src = 'ProjImages/cloud.png';
                break;
            default:
                image.src = 'ProjImages/sun.png';
        }

        this.tempC = parseInt(json.main.temp);
        this.isCelsius = true; // reset
        this.temperatureElem.innerHTML = `${this.tempC}<span>°C</span>`;
        this.toggleBtn.textContent = 'Convert to °F';

        description.innerHTML = `${json.weather[0].description}`;
        humidity.innerHTML = `${json.main.humidity}<span>%</span>`;
        wind.innerHTML = `${parseInt(json.wind.speed)}<span>Km/h</span>`;

        if (this.tempC < 5) {
            this.alert.classList.add('active');
        } else {
            this.alert.classList.remove('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
