"use strict"

const ID = "YOUR_APP_ID";  

const DAY_COLOR_BOTTOM = "#005ed8";
const DAY_COLOR_TOP = "#32d2f8";
const NIGHT_COLOR_BOTTOM = "#60bbee";
const NIGHT_COLOR_TOP = "#595ba6";
const LONDON_LAT = 51.50;
const LONDON_LON = -0.12;
let LAT = LONDON_LAT; //london latitude
let LON = LONDON_LON; //london longitude

// DOM OBJECTS
// setting current data
let User_Location = document.querySelector('#location');
let weatherImage = document.querySelector("#weather-image");
let currentTemperature = document.querySelector("#temperature .number");
let wind = document.querySelector("#wind-humidity .wind-number");
let humidity = document.querySelector("#wind-humidity .humidity-number");
let iconUrl = "http://openweathermap.org/img/w/";
// for setting daily data
let plusThree = document.querySelector("#daily-forecast #plus-three img");
let plusSix = document.querySelector("#daily-forecast #plus-six img");
let plusNine = document.querySelector("#daily-forecast #plus-nine img");
let plusTwelve = document.querySelector("#daily-forecast #plus-twelve img");
// for setting future data (other days)
let future = document.querySelector("#future");

/* ********FUNCTIONS REQUIRED FOR WORKING WITH TODAY'S INFORMATION***********/

// get Current information, get forecast information and then update
function setCurrentData(json) {
    // Set city name
    User_Location.textContent = json.name;
    // Set weather Icon
    let iconCode = json.weather[0].icon;
    weatherImage.src = iconUrl + iconCode + ".png";
    // Set temperature, wind and humidity
    currentTemperature.textContent = Math.round(json.main.temp * 10) / 10;
    wind.textContent = json.wind.speed;
    humidity.textContent = json.main.humidity;

    // change background according to either day or night
    let currentTime = new Date();
    console.log(currentTime.getTime());
    console.log(json.sys.sunrise*1000);
    console.log(json.sys.sunset*1000);

    // day time, then make background sky blue
    if (json.sys.sunrise*1000 <= currentTime.getTime() && currentTime.getTime() < json.sys.sunset*1000){
        document.querySelector('body').style.backgroundImage = "linear-gradient(" + DAY_COLOR_TOP + "," + DAY_COLOR_BOTTOM + ")";
    }
    else{
        document.querySelector('body').style.backgroundImage = "linear-gradient(" + NIGHT_COLOR_TOP + "," + NIGHT_COLOR_BOTTOM + ")";
    }
}

function getCurrentRequest() {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${ID}`;
}
/********** FUNCTIONS REQUIRED FOR WORKING WITH FORECAST INFORMATION  */
let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function getForeCastRequest() {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&APPID=${ID}`;
}
function absDiff(x, y) {
    // returns abs diff of two numbers
    return Math.abs(x - y);
}
function getCurrentTime(json) {
    // returns index from json which is closest to current time
	let current = new Date();
    current = current.getTime();
    let prevDiff = absDiff(Date.parse(json.list[0].dt_txt), current);
    let currentDiff;
    for (let i=0; i<json.list.length; ++i){
        currentDiff = absDiff(Date.parse(json.list[i].dt_txt), current);
        if (currentDiff > prevDiff){
            return --i;
        }
        prevDiff = currentDiff;
    }
}
function getUrl(entry) {
    // get icon image url from given list entry from fetched json object
    let dt_txt = entry.dt_txt.slice(11, 13);
    let hr = Number(dt_txt);
    console.log(hr);
    if (hr >= 6 && hr <= 18) {
        return (iconUrl + entry.weather[0].icon.slice(0, 2) + "d" + ".png");
    }
    else {
        return (iconUrl + entry.weather[0].icon.slice(0, 2) + "n" + ".png");
    }
}
function TwelveHour(j){
    let x = j.split(':');
    let y = x[0];
    let time;
    if (y >= 12){
        time = "PM";
        if (y != 12){
            y = y % 12;
        }
    }
    else{
      if (y == 0){
        y = 12;
      }
      time = "AM";
    }
    return y + ":" + x[1] + " " + time;
}
function setDayData(json) {
    // set image of daily data
    // set current time to be j of that array;
    let j;
    let currentDay = document.querySelector('#daily-forecast');
    if (LAT == 51.50 && LON==-0.12){
        j = 0;
    }
    else{
        j = getCurrentTime(json);
    }
    console.log(j);
    plusThree.src = getUrl(json.list[j + 1]);
    plusSix.src = getUrl(json.list[j + 2]);
    plusNine.src = getUrl(json.list[j + 3]);
    plusTwelve.src = getUrl(json.list[j + 4]);
    for (let i=0; i<4; ++i){
        currentDay.children[i].children[0].textContent = TwelveHour(json.list[i+j+1].dt_txt.slice(11,16));
    }
    return j;
}

function setDaysData(json, j) {
    // set the forcasted data
    let nextIndex;  //a day later
    let tomorrow = new Date(json.list[8].dt * 1000).getDay();
    for (nextIndex = 8; nextIndex <= 24; nextIndex += 8) {
        // Set the day name
        future.children[nextIndex / 8 - 1].children[0].textContent = daysOfWeek[tomorrow];
        tomorrow = (tomorrow + 1) % 7;
        // Set the image
        future.children[nextIndex / 8 - 1].children[1].src = getUrl(json.list[j + nextIndex]);
        // Set the temperature
        future.children[nextIndex / 8 - 1].children[2].textContent = Math.round(json.list[j + nextIndex].main.temp * 10) / 10 + "°C";
    }

}

function setFutureData(json) {
    let currentIndex = setDayData(json);
    setDaysData(json, currentIndex);
}

/* THIS FUNCTION FETCHES BOTH DATA (CURRENT AND FUTURE AND DISPLAYS)*/
function FetchAndDisplay() {
    //hide everything before showing
    document.documentElement.style.visibility = "hidden";

    // daily data fetch
    let currentInfoPromise = fetch(getCurrentRequest())
        .then((obtained) => {
            return obtained.json();
        });

    // fetch future data
    let forecastInfoPromise = fetch(getForeCastRequest())
        .then((obtained) => {
            return obtained.json();
        });

    Promise.all([currentInfoPromise, forecastInfoPromise]).then(
        (values) => {
            console.log(values[0]);
            setCurrentData(values[0]);
            console.log(values[1]);
            setFutureData(values[1]);
            // show everything
            document.documentElement.style.visibility = "visible";
        }
    );
}

/****************ACTUAL PROGRAM: HIGH LEVEL IMPLEMENTATION**************/

/*
    FETCH & DISPLAY DATA OF LONDON -> ASK LOCATION -> FETCH DATA OF GIVEN LOCATION & DISPLAY
*/

FetchAndDisplay();
// After London's information is shown, ask for location permission
if ('geolocation' in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition((position) => {
        LAT = Math.round(position.coords.latitude * 100) / 100;
        LON = Math.round(position.coords.longitude * 100) / 100;
        FetchAndDisplay();
    });
} else {
    alert("Your device does not have location services.");
}