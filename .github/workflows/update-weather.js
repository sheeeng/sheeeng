const Mustache = require('mustache');
const fetch = require('node-fetch');
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
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Oslo,NO&units=metric&appid=${process.env.OPEN_WEATHER_KEY}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  )
    .then(r => r.json())
    .then(r => {
      DATA.city_temperature = Math.round(r.main.temp);
      DATA.city_feels_like = Math.round(r.main.feels_like);
      DATA.city_humidity = Math.round(r.main.humidity);
      DATA.city_pressure = Math.round(r.main.pressure);
      DATA.city_weather = r.weather[0].description;
      DATA.city_weather_icon = r.weather[0].icon;
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
