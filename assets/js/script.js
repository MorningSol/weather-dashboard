var searchInputEl = document.querySelector("#search-input");
var cityInputEl = document.querySelector("#city-input");
var displayCurrentTemp = document.querySelector("#current-temp");
var displayCurrentWind = document.querySelector("#current-wind");
var displayCurrentHumid = document.querySelector("#current-humidity");
var displayCurrentUv = document.querySelector("#current-uv");
var displayCityDate = document.querySelector("#chosenCity-date");
var displayCurrentIcon = document.querySelector("#current-day-icon");
var daysEl = document.querySelectorAll(".days");
var tempsEl = document.querySelectorAll(".temps");
var windsEl = document.querySelectorAll(".winds");
var humidsEl = document.querySelectorAll(".humids");
var weatherIconsEl = document.querySelectorAll(".weather-icon");
var searchHistoryEl = document.querySelector("#history-container");
var cityLocationsArr = [];

//  getting latitude and longitude for city
var getLocationData = function(city) {
    var locationApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=8cb2b7a7319c51f2b5a6a5a0659eecac";

    fetch(locationApi)
    .then(function(response){
        response.json().then(function(data){

            if (data.length == 0 ){
                alert("Error: Could Not Find " + city)
            }
            else {
                var cityName = data[0].name;
                var cityLat = data[0].lat;
                var cityLon = data[0].lon;
        
                saveLocation(cityName)
                getWeatherData(cityLat, cityLon,cityName)
            }
        });   
    })

    .catch(function(error) {
        alert("Unable to connect with OpenWeather");
    }); 
};

//getting weather data by lat/lon
var getWeatherData = function(cityLat, cityLon, cityName) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=metric&exclude=hourly,minutely,&appid=8cb2b7a7319c51f2b5a6a5a0659eecac";

    fetch(weatherApi)
    .then(function(response){
        response.json().then(function(data){

            var CurrentTemp = data.current.temp;
            var currentFeelsLike = data.current.feels_like;
            var currentWindSpeed = data.current.wind_speed;
            
            var currentHumid = data.current.humidity;
            var currentUv = data.current.uvi
            var currentIcon = data.current.weather[0].icon;
            var currentDate = moment().format("DD/MM/YYYY");
            
            displayCityDate.textContent = cityName + " (" + currentDate + ")";
            displayCurrentTemp.textContent = CurrentTemp + " (Feels like " + currentFeelsLike + ")";
            displayCurrentWind.textContent = currentWindSpeed;
            displayCurrentHumid.textContent = currentHumid;
            displayCurrentUv.textContent = currentUv;
            displayCurrentIcon.src = "https://openweathermap.org/img/wn/" + currentIcon + ".png";   
            
            uvStatus(currentUv);

            for (var i = 1; i < 6; i++){

                var fiveDayDate = moment().add(i, 'days').format("DD/MM/YYYY");
                
    
                var fiveDayTemp = data.daily[i].feels_like.day;
                var fiveDayWind = data.daily[i].wind_speed;
                var fiveDayHumid = data.daily[i].humidity;
                var fiveDayIcon = data.daily[i].weather[0].icon;
                
                daysEl[i-1].textContent = fiveDayDate;
                tempsEl[i-1].textContent = fiveDayTemp;
                windsEl[i-1].textContent = fiveDayWind;
                humidsEl[i-1].textContent = fiveDayHumid;
                weatherIconsEl[i-1].src = "https://openweathermap.org/img/wn/" + fiveDayIcon + ".png"
            }
        });

    });
} ;  


// processes user input
var searchInputHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getLocationData(city);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a city");
    }   
};

// save to localStorage and creat array
var saveLocation = function(cityName){
    
    var locationExist = cityLocationsArr.includes(cityName)
       
    if(!locationExist){
    cityLocationsArr.push(cityName);
    localStorage.setItem("cityLocations", JSON.stringify(cityLocationsArr));
    createButton(cityName)
    };
};

// creates a button for quick city reference in search history
var createButton = function(cityName){
    var historyButton = document.createElement("button");
    historyButton.classList = "btn-lg btn-primary w-100 mb-3";
    historyButton.setAttribute("id", cityName)
    historyButton.textContent = cityName;
    searchHistoryEl.appendChild(historyButton);
};

// loads data from localStorage
var loadHistory = function(){
    
    var loadHistorySearch = localStorage.getItem("cityLocations");
    
    if (!loadHistorySearch) {
        return false;
    };
    
    loadHistorySearch = JSON.parse(loadHistorySearch);
    
    cityLocationsArr = loadHistorySearch
        
    for (var i = 0; i < loadHistorySearch.length; i++) {
        createButton(loadHistorySearch[i]);
    };
};

//Handles buttons from search history
var historyButtonHandler = function(event){
    var previousCity = event.target.getAttribute("id");
    getLocationData(previousCity);
};

// checks the severity of uv index with color coding
var uvStatus = function(uvIndex) {
uvIndex = parseInt(uvIndex);
console
    if (uvIndex >= 8) {
        displayCurrentUv.className = "very-high"
    }
    else if(uvIndex >= 6 && uvIndex <= 7) {
        displayCurrentUv.className = "high"
    }
    else if(uvIndex >= 3 && uvIndex <= 5) {
        displayCurrentUv.className = "moderate"   
    }
    else {
        displayCurrentUv.className = "low"
    }
};

searchInputEl.addEventListener("submit", searchInputHandler);
searchHistoryEl.addEventListener("click", historyButtonHandler)
loadHistory();