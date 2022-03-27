var searchInputEl = document.querySelector("#search-input");
var cityInputEl = document.querySelector("#city-input");
var displayCurrentTemp = document.querySelector("#current-temp");
var displayCurrentWind = document.querySelector("#current-wind");
var displayCurrentHumid = document.querySelector("#current-humidity");
var displayCurrentUv = document.querySelector("#current-uv")
var displayCityDate = document.querySelector("#chosenCity-date")
var displayCurrentIcon = document.querySelector("#current-day-icon")


var getLocationData = function(city) {
    var locationApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=8cb2b7a7319c51f2b5a6a5a0659eecac";

    fetch(locationApi)
    .then(function(response){
        response.json().then(function(data){
            var cityName = data[0].name;
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;
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







searchInputEl.addEventListener("submit", searchInputHandler);