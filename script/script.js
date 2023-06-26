// Variable declarations
var map;
var service;
var infowindow;
var APIKeyWeather = "383165bf31a4af053f333f929519989c";
var storedData = JSON.parse(localStorage.getItem('myAppData')) || [];

// Event listener for submit button
$("#formSubmit").on("submit", function (e) {
    e.preventDefault();
    var zipCode = $("#zip").val();
    getCoord(zipCode);
    console.log(zipCode);

    // Push zipcode to local storage
    storedData.unshift(zipCode);
    localStorage.setItem('myAppData', JSON.stringify(storedData));
    zipButtons();
});

// Function to get latitude and longitude from zipcode
function getCoord(zipCode) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&limit=5&appid=${APIKeyWeather}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            console.log(lat, lon);

            initMap(lat, lon);
        });
}

// Function to initialize the map
function initMap(lat, lon) {
    var location = new google.maps.LatLng(lat, lon);
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 8
    });
    var request = {
        location: location,
        radius: '50',
        query: "golf course"
    };
    var request2 = {
        location: location,
        radius: '50',
        query: "brewery"
    };
    var service = new google.maps.places.PlacesService(map);

    // Golf Courses - get data & append to HTML
    service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            document.getElementById("golfcards").innerHTML = "";
            for (var i = 0; i < results.length - 15; i++) {
                var golfName = document.createElement("h2")
                golfName.textContent = results[i].name;
                var golfAddress = document.createElement("h2")
                golfAddress.textContent = results[i].formatted_address;
                var golfcards = document.createElement("div");
                golfcards.setAttribute("class", "golfcards");
                golfcards.append(golfName, golfAddress);
                document.getElementById("golfcards").append(golfcards);
            }
        }
    });

    // Breweries - get data & append to HTML
    service.textSearch(request2, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            document.getElementById("distributorsCards").innerHTML = "";
            for (var i = 0; i < results.length - 15; i++) {
                var distName = document.createElement("h2")
                distName.textContent = results[i].name;
                var distAddress = document.createElement("h2")
                distAddress.textContent = results[i].formatted_address;
                var distcards = document.createElement("div");
                distcards.setAttribute("class", "distributorsCards");
                distcards.append(distName, distAddress);
                document.getElementById("distributorsCards").append(distcards);
            }
        }
    })
}

// Event listener for zip code buttons
$(document).on("click", ".zip", function (e) {
    e.preventDefault();
    var zip = $(this).attr("data-zip");
    console.log(zip);
    getWeather(zip);
    getCoord(zip);
});

// Function to create zip code buttons under local history on HTML
function zipButtons() {
    storedData = JSON.parse(localStorage.getItem('myAppData')) || [];
    $("#zip-buttons").text("");

    if (storedData.length < 5) {
        for (var i = 0; i < storedData.length; i++) {
            var btn = $("<button>");
            btn.text(storedData[i]);
            btn.attr("data-zip", storedData[i]);
            btn.addClass("zip");
            $("#zip-buttons").append(btn);
        }
    }
    else {
        for (var i = 0; i < 5; i++) {
            var btn = $("<button>");
            btn.text(storedData[i]);
            btn.attr("data-zip", storedData[i]);
            btn.addClass("zip");
            $("#zip-buttons").append(btn);
        }
    }
}

zipButtons();

// Function to get weather data based on zip code
function getWeather(zipCode) {
    fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + zipCode + '?key=BC56DV38KGW5TK327XDYHBPXD')
        .then(function (response) {
            return response.json()
        }).then(function (results) {
            console.log(results);
            document.getElementById("weatherCards").innerHTML = "";
            var weatherStatus = document.createElement("h2");
            weatherStatus.textContent = "Conditions: " + results.currentConditions.conditions;
            var weatherName = document.createElement("h2");
            weatherName.textContent = "Humidity: " + results.currentConditions.humidity + " %";
            var weatherTemp = document.createElement("h2");
            weatherTemp.textContent = "Feels like " + results.currentConditions.feelslike + " °F";
            var weatherWind = document.createElement("h2");
            weatherWind.textContent = "Wind speed: " + results.currentConditions.windspeed + " mph";
            var weatherCards = document.createElement("div");
            weatherCards.setAttribute("class", "weatherCards");
            weatherCards.append(weatherName);
            weatherCards.append(weatherTemp);
            weatherCards.append(weatherWind);
            weatherCards.append(weatherStatus);
            document.getElementById("weatherCards").append(weatherCards);
        })
}

// Event listener for submitting zip code form
const zipCodeInput = document.querySelector('#zip');
const submitForm = document.querySelector('#formSubmit');
submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var inputvalue = zipCodeInput.value;
    console.log(inputvalue);
    getWeather(inputvalue);
});
