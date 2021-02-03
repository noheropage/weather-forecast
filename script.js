

// TODO: search bar that accepts name of city

    // TODO: search button 

// TODO: Put that city name into weather API fetch

// TODO: store city names in local storage and display on side
var h = localStorage.getItem("history") || []
localStorage.setItem("history", JSON.stringify(h))

h.push("Portland")

localStorage.setItem("history", JSON.stringify(h))

// TODO: Display current info 

// TODO: Display 5-Day Forecast with icons