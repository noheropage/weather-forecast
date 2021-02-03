var apiKey = "9ffba577a38eec73c530d29d74f789eb"
// var date = new Date(); 

$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var city = $("#searchCity").val();
    if (!city) {
        console.error("You must enter the name of a city");
        return;
    }
    console.log(city);
    searchApi(city)
})

function printCurrent(result) {

    var currentWeather = $("#currentWeather")
    var unixTimestamp = result.dt
    var date = new Date(unixTimestamp * 1000);
    var month = date.getMonth();
    var year = date.getFullYear();
    var day = date.getDay();
    var formattedDate = month + "/" + day + "/" + year

    // TODO: style output
    $(currentWeather).append("<h2>" + result.name + " " + formattedDate + "</h2>")
    $(currentWeather).append("<p>Temperature: " + result.main.temp + " &degF </p>")
    $(currentWeather).append("<p>Humidity: " + result.main.humidity + "% </p>")
    $(currentWeather).append("<p>Wind Speed: " + result.wind.speed + "MPH</p>")
    $(currentWeather).append("<p>UV Index: </p>")  // TODO: UV index 



    console.log(result.name);
}

function printForecast(result) {
    var weatherForecast = $("#weatherForecast")
    for (var i = 0; i < result.list.length; i += 8) {
        var unixTimestamp = result.list[i].dt
        var date = new Date(unixTimestamp * 1000);
        var month = date.getMonth();
        var year = date.getFullYear();
        var day = date.getDay();
        var formattedDate = month + "/" + day + "/" + year
        $(weatherForecast).append("<p>" + formattedDate + "</p>")
        var iconImg = $("<img>")
        var iconCode = result.list[i].weather[i].icon
        console.log(iconCode);
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
        $(iconImg).attr('src', iconUrl)
        $(weatherForecast).append(iconImg)
        $(weatherForecast).append("<p> Temp: " + result.list[i].main.temp + "&degF </p>")
        $(weatherForecast).append("<p> Humidity: " + result.list[i].main.temp + "% </p>")
    }

}

// TODO: Put that city name into weather API fetch
function searchApi(city) {
    var apiCallCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    var apiCallForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(apiCallCurrent).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        console.log(apiCallCurrent);
        return response.json();
    })
        .then(function (current) {
            console.log(current);
            printCurrent(current);
        })
        .catch(function (error) {
            console.error(error);
        });
    fetch(apiCallForecast).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        console.log(apiCallForecast);
        return response.json();
    })
        .then(function (forecast) {
            console.log(forecast);
            printForecast(forecast);
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