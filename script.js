var apiKey = "9ffba577a38eec73c530d29d74f789eb"
var unixTimestamp;
var date;
var month;
var year;
var day;
var formattedDate;

// look through local storage to populate list of buttons of cities previously searched OR create new array
var h = JSON.parse(localStorage.getItem("oldCity")) || []
function parseLocal() {
    $(".search-history").empty()
    for (var i = 0; i < h.length; i++) {
        cityBtn = $("<button>")
        $(cityBtn).attr("class", "btn btn-info btn-block")
        $(cityBtn).attr("id", "searchedCities")
        $(cityBtn).text(h[i])
        $(cityBtn).val(h[i])
        // add buttons so that most recent are at the top
        $(".search-history").prepend(cityBtn)
    }
    localStorage.setItem("oldCity", JSON.stringify(h))

}

// place everything in 'h' into local storage
// localStorage.setItem("oldCity", JSON.stringify(h))

// click event for all buttons new and old
$(document).on("click", ".btn", function (event) {
    event.preventDefault();
    // will trigger api search based on value of field targetted
    var city = $("#searchCity").val() || $(this).val();
    // reset input bar once search button is clicked
    $("#searchCity").val('');
    
    // check to make sure there's something to do an api call for
    if (!city) {
        console.error("You must enter the name of a city");
        return;
    }

    // clear out info fields prior to populating them 
    $("#currentWeather").empty()
    $("#weatherForecast").empty()
    // store most recent search in localstorage
    localStorage.setItem("oldCity", JSON.stringify(h))
    searchApi(city)
})

// uses latitude and longitude to find the uvi
function uvIndex(lat, lon) {
    var apiCallUv = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey
    console.log(apiCallUv);
    fetch(apiCallUv).then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
        .then(function (uv) {
            printUv(uv);
        })
        .catch(function (error) {
            console.error(error);
        });
}

// prints uvi and color codes it
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

    // variables related to date
    unixTimestamp = result.dt
    date = new Date(unixTimestamp * 1000);
    month = date.getMonth();
    year = date.getFullYear();
    day = date.getDate();
    formattedDate = month + "/" + day + "/" + year

    // sets up a img tag to link an icon image from website based on icon code from api
    var iconImg = $("<img>")
    var iconCode = result.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    $(iconImg).attr('src', iconUrl)
    $(currentWeather).append(iconImg)

    // check if city has already been searched for and only adds it to history if it's new
    if (jQuery.inArray(result.name, h) == -1) {
        h.push(result.name)
        parseLocal();
    }

    // use latitude and longitude from api call to use in uv api call
    var lat = result.coord.lat
    var lon = result.coord.lon
    uvIndex(lat, lon)

    // output for current weather conditions
    $(currentWeather).append("<h2>" + result.name + " (" + formattedDate + ") </h2>")
    $(currentWeather).append("<p>Temperature: " + result.main.temp + " &degF </p>")
    $(currentWeather).append("<p>Humidity: " + result.main.humidity + "% </p>")
    $(currentWeather).append("<p>Wind Speed: " + result.wind.speed + "MPH</p>")
}


function printForecast(result) {
    var weatherForecast = $("#weatherForecast")
    var forecastTitle = $("<div>")
    $(forecastTitle).attr("class", "container")
    $(weatherForecast).append(forecastTitle)
    $(forecastTitle).append("<h3>5-Day Forecast: </h3>")
    // api call produces 40 results; increasing the index by 8 gives us 5 days of forecasting data
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
