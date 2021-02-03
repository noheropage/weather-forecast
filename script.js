var apiKey = "9ffba577a38eec73c530d29d74f789eb"
var unixTimestamp;
var date;
var month;
var year;
var day;
var formattedDate;
var cityBtn = $("<button>")

var h = JSON.parse(localStorage.getItem("oldCity")) || []
function parseLocal() {
    $(".search-history").empty()
    for (var i = 0; i < h.length; i++) {
        cityBtn = $("<button>")
        $(cityBtn).attr("class", "btn btn-info btn-block")
        $(cityBtn).attr("id", "searchedCities")
        $(cityBtn).text(h[i])
        $(cityBtn).val(h[i])
        $(".search-history").prepend(cityBtn)
    }
}

localStorage.setItem("oldCity", JSON.stringify(h))

$(document).on("click", ".btn", function (event) {
    event.preventDefault();
    // console.log(this);
    console.log($(this));
    var city = $("#searchCity").val() || $(this).val();
    $("#searchCity").val('');
    if (!city) {
        console.error("You must enter the name of a city");
        return;
    }
    $("#currentWeather").empty()
    $("#weatherForecast").empty()
    localStorage.setItem("oldCity", JSON.stringify(h))
    searchApi(city)
})

function uvIndex(lat, lon) {
    var apiCallUv = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey
    console.log(apiCallUv);
    fetch(apiCallUv).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        // console.log(response.json());
        return response.json();
    })
        .then(function (uv) {
            printUv(uv);
        })
        .catch(function (error) {
            console.error(error);
        });
}


function printUv(uv) {
    var uvValue = uv.current.uvi
    var uvText = $("<p>")
    $(uvText).append("UV Index: " + uvValue + "")
    if (uvValue <= 2) {
        $(uvText).attr("style", "background: green")
    } else if (uvValue > 2 && uvValue <= 5) {
        $(uvText).attr("style", "background: yellow")
    } else {
        $(uvText.attr("style", "background: red"))
    }
    $(currentWeather).append(uvText)  
}

function printCurrent(result) {
    var currentWeather = $("#currentWeather")
    $(currentWeather).attr("class", "border rounded-sm p-3")
    unixTimestamp = result.dt
    date = new Date(unixTimestamp * 1000);
    month = date.getMonth();
    year = date.getFullYear();
    day = date.getDate();
    formattedDate = month + "/" + day + "/" + year

    var iconImg = $("<img>")
    var iconCode = result.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    $(iconImg).attr('src', iconUrl)
    $(currentWeather).append(iconImg)
    if (jQuery.inArray(result.name, h) == -1) {
        h.push(result.name)
        parseLocal();
    }

    var lat = result.coord.lat
    var lon = result.coord.lon
    uvIndex(lat, lon)

    $(currentWeather).append("<h2>" + result.name + " (" + formattedDate + ") </h2>")
    $(currentWeather).append("<p>Temperature: " + result.main.temp + " &degF </p>")
    $(currentWeather).append("<p>Humidity: " + result.main.humidity + "% </p>")
    $(currentWeather).append("<p>Wind Speed: " + result.wind.speed + "MPH</p>")
    // $(currentWeather).append("<p>UV Index: " +  + "</p>")  // TODO: UV index 
}

function printForecast(result) {
    var weatherForecast = $("#weatherForecast")
    var forecastTitle = $("<div>")
    $(forecastTitle).attr("class", "container")
    $(weatherForecast).append(forecastTitle)
    $(forecastTitle).append("<h3>5-Day Forecast: </h3>")
    for (var i = 7; i < result.list.length; i += 8) {
        unixTimestamp = result.list[i].dt
        date = new Date(unixTimestamp * 1000);
        month = date.getMonth();
        year = date.getFullYear();
        day = date.getDate();
        hour = date.getHours();
        formattedDate = month + "/" + day + "/" + year
        var forecastBox = $("<div>")
        $(forecastBox).attr("class", "col bg-primary m-3")
        $(weatherForecast).append(forecastBox)
        $(forecastBox).append("<p><strong>" + formattedDate + "</strong></p>")

        var iconImg = $("<img>")
        var iconCode = result.list[i].weather[0].icon
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
        $(iconImg).attr('src', iconUrl)
        $(iconImg).attr('width', "50px")
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
        return response.json();
    })
        .then(function (current) {
            printCurrent(current);
        })
        .catch(function (error) {
            console.error(error);
        });
    fetch(apiCallForecast).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
        .then(function (forecast) {
            printForecast(forecast);
        })
        .catch(function (error) {
            console.error(error);
        });
}

parseLocal();
