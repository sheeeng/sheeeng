const Mustache = require('mustache');
const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const fs = require('fs');

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  refresh_date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Oslo',
  }),
};

async function setWeatherInformation() {
  openWeatherHeaders = new Headers({
    'Content-Type': 'application/json',
    'Content-Length': content.length.toString(),
  });

  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Oslo,NO&units=metric&appid=${process.env.OPEN_WEATHER_KEY}`,
    { method: 'GET', headers: openWeatherHeaders }
  )
    .then(r => r.json())
    .then(r => {
      console.table(r);
      DATA.city_temperature = Math.round(r.main.temp);
      DATA.city_minimum_temperature = Math.round(r.main.temp_min);
      DATA.city_maximum_temperature = Math.round(r.main.temp_max);
      DATA.city_feels_like = Math.round(r.main.feels_like);
      DATA.city_humidity = Math.round(r.main.humidity);
      DATA.city_pressure = Math.round(r.main.pressure);
      DATA.city_weather = r.weather[0].description;
      DATA.city_weather_icon = r.weather[0].icon;
      DATA.meteorology_data_timestamp = new Date(r.dt * 1000).toLocaleString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: '3',
        timeZone: 'Europe/Oslo',
        timeZoneName: 'short',
      });
      DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Oslo',
      });
      DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Oslo',
      });
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log(output)
  });
}

module.exports = async ({ github, context, core }) => {
  await setWeatherInformation();
  await generateReadMe();
}
