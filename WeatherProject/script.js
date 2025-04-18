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
        this.searchInput = document.getElementById('searchBttn');
        this.searchButton = document.querySelector('.searchBox button');
        this.weatherBox = document.querySelector('.weatherBox');
        this.weatherDetails = document.querySelector('.weatherDetails');
        this.error404 = document.querySelector('.notFound');
        this.alert = document.querySelector('.Alert');
        this.toggleBtn = document.querySelector('.unitToggle');
        this.temperatureElem = document.querySelector('.weatherBox .temperature');
        this.autocompleteItems = document.querySelector('.autocomplete-items');
        this.tempC = 0;
        this.isCelsius = true;

        this.countries = [
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
            "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
            "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", 
            "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
            "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", 
            "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", 
            "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", 
            "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
            "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
            "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
            "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
            "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", 
            "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
            "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", 
            "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Jamaica", 
            "Japan", "Jordan", "Jersey","Kazakhstan", "Kenya", "Kiribati", "Kuwait", 
            "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
            "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
            "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
            "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", 
            "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", 
            "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", 
            "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", 
            "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
            "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
            "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
            "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
            "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
            "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", 
            "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
            "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
            "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", 
            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
            "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
            "Yemen", "Zambia", "Zimbabwe","Palestine"
        ];

        this.weatherService = new WeatherService('5737003f67df08ca4695da8261427176');

        this.init();
    }

    init() {
        this.searchButton.addEventListener('click', () => this.handleSearch());
        this.toggleBtn.addEventListener('click', () => this.toggleTemperatureUnit());
        this.searchInput.addEventListener('input', () => this.autocompleteCountry());
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    autocompleteCountry() {
        const input = this.searchInput.value.toLowerCase();
        this.autocompleteItems.innerHTML = '';
        
        if (!input) {
            this.autocompleteItems.style.display = 'none';
            return;
        }

        const matches = this.countries.filter(country => 
            country.toLowerCase().startsWith(input)
        );

        if (matches.length > 0) {
            matches.forEach(match => {
                const item = document.createElement('div');
                item.textContent = match;
                item.addEventListener('click', () => {
                    this.searchInput.value = match;
                    this.autocompleteItems.style.display = 'none';
                    this.handleSearch();
                });
                this.autocompleteItems.appendChild(item);
            });
            this.autocompleteItems.style.display = 'block';
        } else {
            this.autocompleteItems.style.display = 'none';
        }
    }

    async handleSearch() {
        const city = this.searchInput.value;
        this.autocompleteItems.style.display = 'none';
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
