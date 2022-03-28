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
var searchHistory = document.querySelector("#history-container")
var cityLocationsArr = []


var getLocationData = function(city) {
    var locationApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=8cb2b7a7319c51f2b5a6a5a0659eecac";

    fetch(locationApi)
    .then(function(response){
        response.json().then(function(data){
            var cityName = data[0].name;
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;
            saveLocation(cityName)
            getWeatherData(cityLat, cityLon,cityName)

        });   
    });

}   
var getWeatherData = function(cityLat, cityLon, cityName) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=metric&exclude=hourly,minutely,&appid=8cb2b7a7319c51f2b5a6a5a0659eecac";

    fetch(weatherApi)
    .then(function(response){
        response.json().then(function(data){
            console.log(data)
            var CurrentTemp = data.current.temp;
            var currentFeelsLike = data.current.feels_like;
            var currentWindSpeed = data.current.wind_speed;
            var currentWindGust = data.current.wind_gust;
            var currentHumid = data.current.humidity;
            var currentUv = data.current.uvi
            var currentIcon = data.current.weather[0].icon;
            var currentDate = moment().format("DD/MM/YYYY");
            
            displayCityDate.textContent = cityName + " (" + currentDate + ")"
            displayCurrentTemp.textContent = CurrentTemp + " (Feels like " + currentFeelsLike + ")";
            displayCurrentWind.textContent = currentWindSpeed + " (wind Gust of " + currentWindGust + ")";
            displayCurrentHumid.textContent = currentHumid
            displayCurrentUv.textContent = currentUv
            displayCurrentIcon.src = "http://openweathermap.org/img/wn/" + currentIcon + ".png"   
            
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
                weatherIconsEl[i-1].src = "http://openweathermap.org/img/wn/" + fiveDayIcon + ".png"
            }
        });

    });
}   


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

var saveLocation = function(cityName){
    
    
    var locationExist = cityLocationsArr.includes(cityName)
       
    if(!locationExist){
    cityLocationsArr.push(cityName);
    localStorage.setItem("cityLocations", JSON.stringify(cityLocationsArr));
    createButton(cityName)
    };
};

var createButton = function(cityName){
    var historyButton = document.createElement("button");
    historyButton.classList = "btn-lg btn-primary w-100 mb-3";
    historyButton.setAttribute("id", cityName)
    historyButton.textContent = cityName;
    searchHistory.appendChild(historyButton);

}




searchInputEl.addEventListener("submit", searchInputHandler);