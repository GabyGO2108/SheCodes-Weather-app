let today = new Date();
let h5 = document.querySelector("h5");

let date = today.getDate();
let hours = today.getHours();
let minutes = today.getMinutes();
let year = today.getFullYear();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[today.getDay()];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

let root = "https://api.openweathermap.org";
let apiKey = "49851ccf9dc7b43010c95070e54f87e8";

let month = months[today.getMonth()];
h5.innerHTML = `${day} ${month} ${date}, ${hours}: ${minutes}, ${year}`;

let precipitation = document.querySelector("#precipitation1");

function searchf(event) {
  event.preventDefault();

  let cityElement = document.querySelector("#city");
  let cityInput = document.querySelector("#city-demand");

  cityElement.innerHTML = `Searching for ${cityInput.value}...`;
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchf);

function convertToFahrenheit(event) {
  event.preventDefault();
  let Farenheittemperature = (celsiustemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(Farenheittemperature);
}

let celsiustemp = null;

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiustemp);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

function formatHours(timestamp) {
  return `${hours}:${minutes}`;
}

function currenttemp(response) {
  let temperatureElement = document.querySelector("#temperature");
  let iconElement = document.querySelector("#icon");
  celsiustemp = response.data.main.temp;

  let temperature = Math.round(celsiustemp);

  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#precipitation1").innerHTML =
    Math.round(response.data.main.humidity) + "%";
  document.querySelector("#wind1").innerHTML =
    Math.round(response.data.wind.speed) + "km/h";
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  temperatureElement.innerHTML = `${response.data.name} ${temperature} `;
}

function searchCity(city) {
  let apiKey = "49851ccf9dc7b43010c95070e54f87e8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currenttemp);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-demand").value;
  searchCity(city);
}

function showPosition(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  let apiKey = "49851ccf9dc7b43010c95070e54f87e8";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(currenttemp);

  url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecasttemperaure = null;

  for (let index = 0; index < 5; index++) {
    let forecasttemperature = response.data.list[index];
    forecastElement.innerHTML = `
<div class="col-2">



<h7> 
${formatHours(forecasttemperature.dt * 1000)}
</h7>

<img
src ="http://openweathermap.org/img/wn/${
      forecasttemperature.weather[0].icon
    }@2x.png"
alt=""
/> 




<div class="weather-forecast">
<strong> ${Math.round(
      forecasttemperature.main.temp_max
    )}°</strong> ${Math.round(forecasttemperature.main.temp_min)}°
</div>            
</div>

</div> 
`;
  }
}

function getCurrentPosition() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);
