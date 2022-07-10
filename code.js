let currentTime = new Date();
function displayTime() {
  let days = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];
  let day = days[currentTime.getDay()];
  let hour = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let displayCurrentTime = `${day}, ${hour}:${minutes}`;
  return displayCurrentTime;
}
let showTime = document.querySelector(`#date`);
showTime.innerHTML = displayTime(currentTime);

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day}, ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
function displayForecast(response) {
  console.log(response.data);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-sm ">
      <h3 class="weekdays">${formatDay(forecastDay.dt)}</h3>
        
        <img class="icon" 
          src="media/${forecastDay.weather[0].icon}.svg"
          alt="${forecastDay.weather[0].description}"
        />
        <h3 class="temperature">${Math.round(forecastDay.temp.day)} °C</h3>
        
        
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "0f380eeef06d6360d28eb090a2663364";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  document.querySelector(".city-name").innerHTML = response.data.name;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  let iconElement = document.querySelector(`.iconbig`);
  iconElement.setAttribute("src", `media/${response.data.weather[0].icon}.svg`);

  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}
function search(city) {
  let apiKey = "0f380eeef06d6360d28eb090a2663364";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}
function displayCityInput(event) {
  event.preventDefault();
  //let cityNameInput = document.querySelector(`#city-input`);
  //let cityName = document.querySelector(`.city-name`);
  //cityName.innerHTML = `${cityNameInput.value}`;

  let citySearchResult = document.querySelector(`#city-input`);
  search(citySearchResult.value);
}

let citySearchForm = document.querySelector(`#city-search-form`);
citySearchForm.addEventListener(`submit`, displayCityInput);

function locationWeather(response) {
  let h1 = document.querySelector(`.city-name`);
  h1.innerHTML = `${response.data.name}`;
  let locationTemperature = document.querySelector(`#temperature`);
  celsiusTemperature = response.data.main.temp;
  let newTemperature = Math.round(celsiusTemperature);
  locationTemperature.innerHTML = `${newTemperature}`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  let iconElement = document.querySelector(`.iconbig`);
  iconElement.setAttribute("src", `media/${response.data.weather[0].icon}.svg`);

  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove(`active`);
  fahrenheitLink.classList.add(`active`);
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add(`active`);
  fahrenheitLink.classList.remove(`active`);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);
let celsiusTemperature = null;

function coordinates(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  let apiKey = "0f380eeef06d6360d28eb090a2663364";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(locationWeather);
}
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(coordinates);
}
let myLocationButton = document.querySelector(`#my-location`);
myLocationButton.addEventListener(`click`, getCurrentLocation);
search(`Kiev`);
