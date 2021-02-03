var apiKey = "9ffba577a38eec73c530d29d74f789eb"
var unixTimestamp;
var date;
var month;
var year;
var day;
var formattedDate;


$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var city = $("#searchCity").val();
    if (!city) {
        console.error("You must enter the name of a city");
        return;
    }
    console.log(city);
    searchApi(city)
    // TODO: clear form 
    // TODO: store city in local storage 
})

function printCurrent(result) {

    var currentWeather = $("#currentWeather")
    unixTimestamp = result.dt
    date = new Date(unixTimestamp * 1000);
    month = date.getMonth();
    year = date.getFullYear();
    day = date.getDate();
    formattedDate = month + "/" + day + "/" + year

    // TODO: style output
    $(currentWeather).append("<h2>" + result.name + " (" + formattedDate + ") </h2>")
    $(currentWeather).append("<p>Temperature: " + result.main.temp + " &degF </p>")
    $(currentWeather).append("<p>Humidity: " + result.main.humidity + "% </p>")
    $(currentWeather).append("<p>Wind Speed: " + result.wind.speed + "MPH</p>")
    $(currentWeather).append("<p>UV Index: </p>")  // TODO: UV index 



    console.log(result.name);
}

function printForecast(result) {
    var weatherForecast = $("#weatherForecast")
    var forecastTitle = $("<div>")
    $(forecastTitle).attr("class", "container")
    $(weatherForecast).append(forecastTitle)
    $(forecastTitle).append("<h3>5-Day Forecast: </h3>")
    // $(weatherForecast).append("<hr><br>")
    for (var i = 7; i < result.list.length; i += 8) {
        console.log(i);
        unixTimestamp = result.list[i].dt
        date = new Date(unixTimestamp * 1000);
        month = date.getMonth();
        year = date.getFullYear();
        day = date.getDate();
        hour = date.getHours();
        console.log(day);
        console.log(hour);
        formattedDate = month + "/" + day + "/" + year
        var forecastBox = $("<div>")
        $(forecastBox).attr("class", "col bg-primary m-3")
        $(weatherForecast).append(forecastBox)
        $(forecastBox).append("<p><strong>" + formattedDate + "</strong></p>")

        // var iconImg = $("<img>")
        // var iconCode = result.list[i].weather[i].icon
        // console.log(iconCode);
        // var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
        // $(iconImg).attr('src', iconUrl)
        // $(weatherForecast).append(iconImg)
        $(forecastBox).append("<p> Temp: " + result.list[i].main.temp + "&degF </p>")
        $(forecastBox).append("<p> Humidity: " + result.list[i].main.temp + "% </p>")
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