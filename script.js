var apiKey = "9ffba577a38eec73c530d29d74f789eb"
var unixTimestamp;
var date;
var month;
var year;
var day;
var formattedDate;

var h = JSON.parse(localStorage.getItem("oldCity")) || []
function parseLocal() {
    $(".search-history").empty()
    for (var i = 0; i < h.length; i++) {
        var searchBtn = $("<button>")
        $(searchBtn).attr("class", "btn btn-info btn-block")
        $(searchBtn).text(h[i])
        $(searchBtn).val(h[i])
        $(".search-history").prepend(searchBtn)
    }
}


localStorage.setItem("oldCity", JSON.stringify(h))


$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var city = $("#searchCity").val();
    if (!city) {
        console.error("You must enter the name of a city");
        return;
    }
    $("#currentWeather").empty()
    $("#weatherForecast").empty()
    // console.log(city);
    // h.push(city)
    localStorage.setItem("oldCity", JSON.stringify(h))
    parseLocal()
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

    var iconImg = $("<img>")
    var iconCode = result.weather[0].icon
    // console.log(iconCode);
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    $(iconImg).attr('src', iconUrl)
    $(currentWeather).append(iconImg)
    if (jQuery.inArray(result.name, h) == -1) {
        console.log("not in the array yet");
        h.push(result.name)
    }
    
    // TODO: style output
    $(currentWeather).append("<h2>" + result.name + " (" + formattedDate + ") </h2>")
    $(currentWeather).append("<p>Temperature: " + result.main.temp + " &degF </p>")
    $(currentWeather).append("<p>Humidity: " + result.main.humidity + "% </p>")
    $(currentWeather).append("<p>Wind Speed: " + result.wind.speed + "MPH</p>")
    $(currentWeather).append("<p>UV Index: </p>")  // TODO: UV index 



    // console.log(result.name);
}

function printForecast(result) {
    var weatherForecast = $("#weatherForecast")
    var forecastTitle = $("<div>")
    $(forecastTitle).attr("class", "container")
    $(weatherForecast).append(forecastTitle)
    $(forecastTitle).append("<h3>5-Day Forecast: </h3>")
    for (var i = 7; i < result.list.length; i += 8) {
        // console.log(i);
        unixTimestamp = result.list[i].dt
        date = new Date(unixTimestamp * 1000);
        month = date.getMonth();
        year = date.getFullYear();
        day = date.getDate();
        hour = date.getHours();
        // console.log(day);
        // console.log(hour);
        formattedDate = month + "/" + day + "/" + year
        var forecastBox = $("<div>")
        $(forecastBox).attr("class", "col bg-primary m-3")
        $(weatherForecast).append(forecastBox)
        $(forecastBox).append("<p><strong>" + formattedDate + "</strong></p>")

        var iconImg = $("<img>")
        var iconCode = result.list[i].weather[0].icon
        // console.log(iconCode);
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
        $(iconImg).attr('src', iconUrl)
        $(forecastBox).append(iconImg)
        $(forecastBox).append("<p> Temp: " + result.list[i].main.temp + "&degF </p>")
        $(forecastBox).append("<p> Humidity: " + result.list[i].main.temp + "% </p>")
    }

}

function searchApi(city) {
    var apiCallCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    var apiCallForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(apiCallCurrent).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        // console.log(apiCallCurrent);
        return response.json();
    })
        .then(function (current) {
            // console.log(current);
            printCurrent(current);
        })
        .catch(function (error) {
            console.error(error);
        });
    fetch(apiCallForecast).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        // console.log(apiCallForecast);
        return response.json();
    })
        .then(function (forecast) {
            // console.log(forecast);
            printForecast(forecast);
        })
        .catch(function (error) {
            console.error(error);
        });
}

parseLocal();


// TODO: store city names in local storage and display on side

// TODO: Display current info 

// TODO: Display 5-Day Forecast with icons