var apiKey = "9ffba577a38eec73c530d29d74f789eb"


// TODO: search bar that accepts name of city


// console.log(apiCall);
    // TODO: search button 
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var city = $("#searchCity").val();
    if (!city) {
        console.error("You must enter the name of a city");
        return;
    }
    console.log(city);
    searchApi(city)
})

function printResult(result) {

    var currentWeather = $("#currentWeather")
    var weatherForecast = $("#weatherForecast")
    $(currentWeather).append("<p>" + result.name + "</p>")
    $(currentWeather).append("<p>Temperature: " + result.main.temp + " &degF </p>")
    $(currentWeather).append("<p>Humidity: " + result.main.humidity + "% </p>")
    $(currentWeather).append("<p>Wind Speed: " + result.wind.speed + "MPH</p>")
    $(currentWeather).append("<p>UV Index: </p>")  // TODO: UV index 
    
    console.log(result.name);
}

// TODO: Put that city name into weather API fetch
function searchApi(city) {
    var apiCall = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(apiCall).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        console.log(apiCall);
        // console.log(response.json())
        return response.json();
    })
    .then(function (locRes) {
        console.log(locRes);
        printResult(locRes);
    })
    .catch(function (error) {
        console.error(error);
    });
}




// TODO: store city names in local storage and display on side
// var h = localStorage.getItem("history") || []
// localStorage.setItem("history", JSON.stringify(h))

// h.push("Portland")

// localStorage.setItem("history", JSON.stringify(h))

// TODO: Display current info 

// TODO: Display 5-Day Forecast with icons