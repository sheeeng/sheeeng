const Mustache = require('mustache');
const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const fs = require('fs');
const convert = require('xml-js');

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

  meteorologyHeaders = new Headers({
    'User-Agent': 'github.com/sheeeng leonard.sheng.sheng.lee@gmail.com',
  });

  // https://stackoverflow.com/questions/37693982/how-to-fetch-xml-with-fetch-api/41009103#41009103
  // https://gist.github.com/prof3ssorSt3v3/61ccf69758cd6dbdc429934564864650
  // https://stackoverflow.com/questions/11398419/trying-to-use-the-domparser-with-node-js/55668667#55668667

  let dataAsJson = {};

  await fetch(
    'https://api.met.no/weatherapi/sunrise/2.0/?lat=59.933333&lon=10.716667&date=$(date "+%Y-%m-%d")&offset=+02:00',
    { method: 'GET', headers: meteorologyHeaders }
  )
    .then(response => response.text())
    .then(xmlString => {
      dataAsJson = JSON.parse(convert.xml2json(xmlString))
    })
    .then(() => {
      console.log(dataAsJson.elements[0].elements[1]) // astrodata / location
      console.log("~~~~~~~~")
      console.log(dataAsJson.elements[0].elements[1].attributes.latitude)
      console.log("~~~~~~~~")
      console.log(dataAsJson.elements[0].elements[1].attributes.longitude)
      console.log("~~~~~~~~")
      console.log(dataAsJson.elements[0].elements[1].elements[0].elements[0]) // astrodata / location / time
      console.log("~~~~~~~~")
      console.log(dataAsJson.elements[0].elements[1].elements[0].elements[0].attributes.value) // astrodata / location / time / moonphase
      console.log("~~~~~~~~")
    })
    .then(() => {
      console.log("ObjectDump: %o", dataAsJson.elements
        .filter(obj => { return obj.name == 'astrodata'; })[0].elements
        .filter(obj => { return obj.name == 'location'; })[0].elements
        .filter(obj => { return obj.name == 'time'; })[0].elements
        .filter(obj => { return obj.name == 'moonphase'; })[0].attributes.value
      )
    })
    .then(() => {
      DATA.moonphase_value = Math.round(dataAsJson.elements
        .filter(obj => { return obj.name == 'astrodata'; })[0].elements
        .filter(obj => { return obj.name == 'location'; })[0].elements
        .filter(obj => { return obj.name == 'time'; })[0].elements
        .filter(obj => { return obj.name == 'moonphase'; })[0].attributes.value);

      // echo "⇓⇓⇓⇓⇓⇓⇓⇓ Moon Phase ⇓⇓⇓⇓⇓⇓⇓⇓
      // 🌑 :new_moon:                   100/0
      // 🌒 :waxing_crescent_moon:       0<n<25
      // 🌓 :first_quarter_moon:         25
      // 🌔 :moon: :waxing_gibbous_moon: 25<n<50
      // 🌕 :full_moon:                  50
      // 🌖 :waning_gibbous_moon:        50<n<75
      // 🌗 :last_quarter_moon:          75
      // 🌘 :waning_crescent_moon:"      75<n<100

      // moonphase (time, value), value representing:
      // 0..25: "waxing crescent"
      // 25..50: "waxing gibbous"
      // 50..75: "waning gibbous"
      // 75..100: "waning crescent"

      if (Math.round(DATA.moonphase_value) == 0
        || Math.round(DATA.moonphase_value) == 100) {
        DATA.moonphase_emoji = ':new_moon:';
        DATA.moonphase_name = 'New';
        console.log('🌑 :new_moon:');
      } else if (between(DATA.moonphase_value, 0, 25)) {
        DATA.moonphase_emoji = ':waxing_crescent_moon:';
        DATA.moonphase_name = 'Waxing Crescent';
        console.log('🌒 :waxing_crescent_moon:');
      } else if (Math.round(DATA.moonphase_value) == 25) {
        DATA.moonphase_emoji = ':first_quarter_moon:';
        DATA.moonphase_name = 'First Quarter';
        console.log('🌓 :first_quarter_moon:');
      } else if (between(DATA.moonphase_value, 25, 50)) {
        DATA.moonphase_emoji = ':waxing_gibbous_moon:';
        DATA.moonphase_name = 'Waxing Gibbous';
        console.log('🌔 :waxing_gibbous_moon:');
      } else if (Math.round(DATA.moonphase_value) == 50) {
        DATA.moonphase_emoji = ':full_moon:';
        DATA.moonphase_name = 'Full';
        console.log('🌕 :full_moon:');
      } else if (between(DATA.moonphase_value, 50, 75)) {
        DATA.moonphase_emoji = ':waning_gibbous_moon:';
        DATA.moonphase_name = 'Waning Gibbous';
        console.log('🌖 :waning_gibbous_moon:');
      } else if (Math.round(DATA.moonphase_value) == 75) {
        DATA.moonphase_emoji = ':last_quarter_moon:';
        DATA.moonphase_name = 'Last Quarter';
        console.log('🌗:last_quarter_moon:');
      } else if (between(DATA.moonphase_value, 75, 100)) {
        DATA.moonphase_emoji = ':waning_crescent_moon:';
        DATA.moonphase_name = 'Waning Crescent';
        console.log('🌘 :waning_crescent_moon:');
      } else {
        console.error('⚠️ Unknown Moonphase ⚠️ : ' + DATA.moonphase_value);
      }
    });

  function between(value, first, last) {
    let lower = Math.min(first, last), upper = Math.max(first, last);
    return value > lower && value < upper;
  }

  openWeatherHeaders = new Headers({
    'Content-Type': 'application/json',
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
